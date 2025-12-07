// Production-ready version of claude.js
// Replace the content of src/lib/claude.js with this file to enable production AI extraction

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const CLAUDE_API_URL = import.meta.env.VITE_CLAUDE_API_URL;

export async function extractFlashcardsFromText(spanishText) {
  // In production, we need either the Lambda URL or local proxy
  if (!import.meta.env.DEV && !CLAUDE_API_URL) {
    throw new Error('AI extraction requires VITE_CLAUDE_API_URL in production. See ENABLE-AI-PRODUCTION.md for setup instructions.');
  }

  // In development, we need the API key for local proxy
  if (import.meta.env.DEV && !ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured in .env');
  }

  const prompt = `You are a Spanish language teacher creating flashcards.

Given the following Spanish text, extract useful phrases, idioms, or vocabulary words that would make good flashcards for English speakers learning Spanish.

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

Spanish text:
${spanishText}`;

  try {
    // Use configured URL, or fall back to defaults
    const apiUrl = CLAUDE_API_URL ||
      (import.meta.env.DEV
        ? 'http://localhost:3001/api/claude'
        : '/api/claude');

    console.log('🤖 Using Claude API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse the JSON response
    const flashcards = JSON.parse(text);

    console.log('✅ Claude extracted', flashcards.length, 'flashcards');
    return flashcards;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

export function isClaudeConfigured() {
  // Production: Check for Lambda URL
  // Development: Check for API key
  return !!CLAUDE_API_URL || (import.meta.env.DEV && !!ANTHROPIC_API_KEY);
}
