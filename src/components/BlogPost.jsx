import { ArrowLeft } from 'lucide-react';

function CodeBlock({ children, language }) {
  return (
    <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg border-2 border-[#2c2c2c] overflow-x-auto text-xs sm:text-sm leading-relaxed font-mono my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function BlogPost({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 relative z-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 font-marker text-sm text-gray-600 hover:text-[#2c2c2c] transition-colors lowercase"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        back
      </button>

      {/* Article card */}
      <article className="bg-white/90 p-6 sm:p-8 rounded-xl border-[3px] border-[#2c2c2c] shadow-[0_4px_0_#2c2c2c] relative overflow-hidden">
        <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

        <div className="relative z-10">
          {/* Title */}
          <h1 className="font-playful text-2xl sm:text-3xl font-black text-[#2c2c2c] mb-2 leading-tight">
            Using Claude to extract structured flashcard data from raw text
          </h1>

          <p className="font-indie text-sm text-gray-500 mb-6">
            April 2025
          </p>

          {/* Intro */}
          <div className="space-y-4 font-indie text-base text-[#2c2c2c] leading-relaxed">
            <p>
              I built <a href="https://github.com/chrisdaly/baraja" className="text-spanish-red underline hover:text-red-700">Baraja</a>, a Spanish flashcard app where you paste raw Spanish text and get structured flashcards back. The interesting part is the Claude API integration that handles extraction. This post covers how that works, what the prompt looks like, and what I'd change if I were starting over.
            </p>

            {/* Section: Why an LLM */}
            <h2 className="font-playful text-xl sm:text-2xl font-black text-[#2c2c2c] pt-4">
              Why an LLM instead of a dictionary API
            </h2>

            <p>
              The first version of Baraja had manual card entry. You'd type a Spanish phrase, its English translation, and three example sentences. It worked, but creating cards was tedious enough that I rarely did it.
            </p>

            <p>
              A dictionary API was the obvious next step, but it wouldn't solve the actual problem. When I encounter new Spanish in the wild (a TikTok caption, an article, a conversation I overheard), I'm not looking up isolated words. I want multi-word phrases like <span className="font-handwritten text-spanish-red">"hacer puente"</span> (to take a long weekend) or <span className="font-handwritten text-spanish-red">"dar igual"</span> (to not matter). Dictionary APIs handle single-word lookups well. They don't extract natural phrases from running text, and they certainly don't generate contextual example sentences.
            </p>

            <p>
              An LLM can do both. Give it a block of Spanish text and it returns the phrases worth learning, with translations and examples, in a single API call.
            </p>

            {/* Section: The prompt */}
            <h2 className="font-playful text-xl sm:text-2xl font-black text-[#2c2c2c] pt-4">
              The prompt
            </h2>

            <p>
              The prompt in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">src/lib/claude.js</code> asks Claude to act as a Spanish teacher, extract 3-5 useful phrases from the input text, and return them as a JSON array:
            </p>

            <CodeBlock>{`You are a Spanish language teacher creating flashcards.

Given the following Spanish text, extract useful phrases, idioms, or vocabulary
words that would make good flashcards for English speakers learning Spanish.

For each phrase/word you extract:
1. Provide the Spanish phrase (lowercase)
2. Provide the English translation
3. Create 3 example sentences in Spanish with English translations

Format your response as valid JSON array with this structure:
[
  {
    "spanish": "phrase in spanish",
    "english": "english translation",
    "examples": [
      {"spanish": "Example sentence 1.", "english": "Translation 1."},
      {"spanish": "Example sentence 2.", "english": "Translation 2."},
      {"spanish": "Example sentence 3.", "english": "Translation 3."}
    ]
  }
]

Extract 3-5 of the most useful/interesting phrases from the text.
Only return the JSON array, no other text.`}</CodeBlock>

            <p>A few design decisions in there:</p>

            <p>
              <strong className="font-marker text-sm">"Natural phrases" over isolated vocabulary.</strong>{' '}
              The prompt says "phrases, idioms, or vocabulary words" but leads with phrases. This biases the output toward multi-word expressions that are harder to look up in a dictionary. In practice, Claude picks up collocations and idiomatic expressions pretty reliably.
            </p>

            <p>
              <strong className="font-marker text-sm">Lowercase Spanish.</strong>{' '}
              The prompt specifies lowercase. Spanish capitalisation rules differ from English, and for flashcard review consistency, everything should be lowercase. Without this instruction, Claude would capitalise sentence-initially.
            </p>

            <p>
              <strong className="font-marker text-sm">Fixed example count.</strong>{' '}
              Three examples per card, always. This keeps the UI predictable. The card component expects exactly three example slots, so the prompt enforces that constraint at generation time rather than handling variable-length arrays in the frontend.
            </p>

            <p>
              <strong className="font-marker text-sm">"Only return the JSON array, no other text."</strong>{' '}
              This is the line that makes raw <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">JSON.parse()</code> viable. Without it, Claude tends to wrap the JSON in a preamble ("Here are the flashcards I extracted:") or add a closing remark. With the instruction, it reliably returns bare JSON.
            </p>

            {/* Section: The proxy */}
            <h2 className="font-playful text-xl sm:text-2xl font-black text-[#2c2c2c] pt-4">
              The proxy
            </h2>

            <p>
              The Anthropic API doesn't accept requests from browsers. There's no CORS header on <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">api.anthropic.com</code>, and even if there were, you'd be exposing your API key in client-side code. So you need a server-side component.
            </p>

            <p>
              The simplest version of this is <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">server.js</code>, a ~30 line Express server:
            </p>

            <CodeBlock language="javascript">{`app.post('/api/claude', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.json(data);
});`}</CodeBlock>

            <p>
              It does one thing: receives the request body from the frontend, adds the API key and version header, forwards to Anthropic, returns the response. No transformation, no caching, no auth. The frontend constructs the full messages API payload (model, max_tokens, messages array) and the proxy passes it through.
            </p>

            <p>
              For production, I swapped this for an AWS Lambda behind a function URL, which is the same pattern but without running an Express server. The frontend checks for a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">VITE_CLAUDE_API_URL</code> environment variable and falls back to the local proxy in development.
            </p>

            {/* Section: Parsing */}
            <h2 className="font-playful text-xl sm:text-2xl font-black text-[#2c2c2c] pt-4">
              Parsing the response
            </h2>

            <p>The parsing is one line:</p>

            <CodeBlock language="javascript">{`const data = await response.json();
const text = data.content[0].text;
const flashcards = JSON.parse(text);`}</CodeBlock>

            <p>
              Claude's messages API returns a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">content</code> array where each element has a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">type</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">text</code>. For a simple text response, there's one element. The text content is the raw JSON string (because the prompt asked for nothing else), so <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">JSON.parse</code> handles it directly.
            </p>

            <p>
              This works. It also breaks if Claude decides to include any non-JSON text, or if the JSON is malformed. In practice, with the "only return the JSON array" instruction on <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">claude-sonnet-4-20250514</code>, I haven't hit a parsing failure in normal use. But there's no fallback, no retry, no graceful error. If parsing fails, the user sees a generic error message.
            </p>

            <p>
              After extraction, the cards are presented one at a time for review. The user flips each card, edits if needed, keeps or skips it. Kept cards are batch-inserted into Supabase. This review step is important because Claude occasionally extracts phrases that are too basic ("muy bien") or too obscure for the user's level.
            </p>

            {/* Section: What I'd do differently */}
            <h2 className="font-playful text-xl sm:text-2xl font-black text-[#2c2c2c] pt-4">
              What I'd do differently
            </h2>

            <p>
              <strong className="font-marker text-sm">Use tool use for structured output.</strong>{' '}
              The biggest improvement would be replacing the "return JSON, I'll parse it" pattern with Claude's{' '}
              <a href="https://docs.anthropic.com/en/docs/build-with-claude/tool-use" className="text-spanish-red underline hover:text-red-700">tool use</a>{' '}
              feature. You define a JSON schema for the output and Claude returns it as a tool call with guaranteed structure. No more "only return the JSON array" instructions, no more <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">JSON.parse</code> on raw text, no more risk of preamble text breaking the parser. The schema would enforce the exact shape (array of objects with <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">spanish</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">english</code>, and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">examples</code> fields) at the API level rather than relying on prompt compliance.
            </p>

            <p>
              <strong className="font-marker text-sm">Add a system message.</strong>{' '}
              The current implementation puts everything in a single user message. Splitting the persona ("You are a Spanish language teacher") into a system message and keeping only the text input in the user message would be cleaner and follows Anthropic's recommended pattern.
            </p>

            <p>
              <strong className="font-marker text-sm">Cache the system prompt.</strong>{' '}
              Anthropic's API supports{' '}
              <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching" className="text-spanish-red underline hover:text-red-700">prompt caching</a>.{' '}
              The system message and schema are identical across every request, only the input text changes. Caching the static portion would reduce latency and cost for repeated extractions. With the current setup, every request sends the full prompt from scratch.
            </p>

            <p>
              <strong className="font-marker text-sm">Stream the response.</strong>{' '}
              Right now the user stares at a loading spinner until the full response arrives. The messages API supports streaming, and for the review-one-card-at-a-time UX, you could start showing the first extracted card while Claude is still generating the rest. This would require switching from the simple <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">fetch</code> + <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300">JSON.parse</code> approach to processing server-sent events and parsing partial JSON, which adds real complexity.
            </p>

            <p>
              <strong className="font-marker text-sm">Rate-limit the proxy.</strong>{' '}
              The Express proxy forwards any request body to Anthropic with no validation. In a multi-user setup, there's nothing preventing someone from sending arbitrary prompts through it. For a personal project this doesn't matter, but it's the kind of thing that would bite you in production.
            </p>

            <p>
              The core pattern (prompt for structured data, parse the response, present for human review) has held up well. The rough edges are all in the plumbing, not the approach.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
