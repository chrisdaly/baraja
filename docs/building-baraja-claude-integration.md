# Using Claude to extract structured flashcard data from raw text

I built [Baraja](https://github.com/chrisdaly/baraja), a Spanish flashcard app where you paste raw Spanish text and get structured flashcards back. The interesting part is the Claude API integration that handles extraction. This post covers how that works, what the prompt looks like, and what I'd change if I were starting over.

## Why an LLM instead of a dictionary API

The first version of Baraja had manual card entry. You'd type a Spanish phrase, its English translation, and three example sentences. It worked, but creating cards was tedious enough that I rarely did it.

A dictionary API was the obvious next step, but it wouldn't solve the actual problem. When I encounter new Spanish in the wild (a TikTok caption, an article, a conversation I overheard), I'm not looking up isolated words. I want multi-word phrases like "hacer puente" (to take a long weekend) or "dar igual" (to not matter). Dictionary APIs handle single-word lookups well. They don't extract natural phrases from running text, and they certainly don't generate contextual example sentences.

An LLM can do both. Give it a block of Spanish text and it returns the phrases worth learning, with translations and examples, in a single API call.

## The prompt

The prompt in `src/lib/claude.js` asks Claude to act as a Spanish teacher, extract 3-5 useful phrases from the input text, and return them as a JSON array:

```
You are a Spanish language teacher creating flashcards.

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
Only return the JSON array, no other text.
```

A few design decisions in there:

**"Natural phrases" over isolated vocabulary.** The prompt says "phrases, idioms, or vocabulary words" but leads with phrases. This biases the output toward multi-word expressions that are harder to look up in a dictionary. In practice, Claude picks up collocations and idiomatic expressions pretty reliably.

**Lowercase Spanish.** The prompt specifies lowercase. Spanish capitalisation rules differ from English, and for flashcard review consistency, everything should be lowercase. Without this instruction, Claude would capitalise sentence-initially.

**Fixed example count.** Three examples per card, always. This keeps the UI predictable. The card component expects exactly three example slots, so the prompt enforces that constraint at generation time rather than handling variable-length arrays in the frontend.

**"Only return the JSON array, no other text."** This is the line that makes raw `JSON.parse()` viable. Without it, Claude tends to wrap the JSON in a preamble ("Here are the flashcards I extracted:") or add a closing remark. With the instruction, it reliably returns bare JSON.

## The proxy

The Anthropic API doesn't accept requests from browsers. There's no CORS header on `api.anthropic.com`, and even if there were, you'd be exposing your API key in client-side code. So you need a server-side component.

The simplest version of this is `server.js`, a ~30 line Express server:

```javascript
app.post('/api/claude', async (req, res) => {
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
});
```

It does one thing: receives the request body from the frontend, adds the API key and version header, forwards to Anthropic, returns the response. No transformation, no caching, no auth. The frontend constructs the full messages API payload (model, max_tokens, messages array) and the proxy passes it through.

For production, I swapped this for an AWS Lambda behind a function URL, which is the same pattern but without running an Express server. The frontend checks for a `VITE_CLAUDE_API_URL` environment variable and falls back to the local proxy in development.

## Parsing the response

The parsing is one line:

```javascript
const data = await response.json();
const text = data.content[0].text;
const flashcards = JSON.parse(text);
```

Claude's messages API returns a `content` array where each element has a `type` and `text`. For a simple text response, there's one element. The text content is the raw JSON string (because the prompt asked for nothing else), so `JSON.parse` handles it directly.

This works. It also breaks if Claude decides to include any non-JSON text, or if the JSON is malformed. In practice, with the "only return the JSON array" instruction on `claude-sonnet-4-20250514`, I haven't hit a parsing failure in normal use. But there's no fallback, no retry, no graceful error. If parsing fails, the user sees a generic error message.

After extraction, the cards are presented one at a time for review. The user flips each card, edits if needed, keeps or skips it. Kept cards are batch-inserted into Supabase. This review step is important because Claude occasionally extracts phrases that are too basic ("muy bien") or too obscure for the user's level.

## What I'd do differently

**Use tool use for structured output.** The biggest improvement would be replacing the "return JSON, I'll parse it" pattern with Claude's [tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) feature. You define a JSON schema for the output and Claude returns it as a tool call with guaranteed structure. No more "only return the JSON array" instructions, no more `JSON.parse` on raw text, no more risk of preamble text breaking the parser. The schema would enforce the exact shape (array of objects with `spanish`, `english`, and `examples` fields) at the API level rather than relying on prompt compliance.

**Add a system message.** The current implementation puts everything in a single user message. Splitting the persona ("You are a Spanish language teacher") into a system message and keeping only the text input in the user message would be cleaner and follows Anthropic's recommended pattern.

**Cache the system prompt.** Anthropic's API supports [prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching). The system message and schema are identical across every request, only the input text changes. Caching the static portion would reduce latency and cost for repeated extractions. With the current setup, every request sends the full prompt from scratch.

**Stream the response.** Right now the user stares at a loading spinner until the full response arrives. The messages API supports streaming, and for the review-one-card-at-a-time UX, you could start showing the first extracted card while Claude is still generating the rest. This would require switching from the simple `fetch` + `JSON.parse` approach to processing server-sent events and parsing partial JSON, which adds real complexity.

**Rate-limit the proxy.** The Express proxy forwards any request body to Anthropic with no validation. In a multi-user setup, there's nothing preventing someone from sending arbitrary prompts through it. For a personal project this doesn't matter, but it's the kind of thing that would bite you in production.

The core pattern (prompt for structured data, parse the response, present for human review) has held up well. The rough edges are all in the plumbing, not the approach.
