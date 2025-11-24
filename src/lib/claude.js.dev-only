// Claude API integration for extracting flashcards from Spanish text

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function extractFlashcardsFromText(spanishText) {
  // Check if we're in production mode
  if (!import.meta.env.DEV) {
    throw new Error('AI extraction is only available in development mode. Run the app locally with "npm run dev:all" to use this feature.');
  }

  if (!ANTHROPIC_API_KEY) {
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
    // Use local proxy server to avoid CORS issues
    const apiUrl = import.meta.env.DEV
      ? 'http://localhost:3001/api/claude'
      : '/api/claude'; // In production, you'd need a serverless function or backend

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
  // AI extraction only works in development mode (requires local proxy server)
  return import.meta.env.DEV && !!ANTHROPIC_API_KEY;
}
