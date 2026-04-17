# Baraja

A flashcard app for learning Spanish. Paste raw Spanish text — an article, a caption, a script — and Claude extracts vocabulary into structured flashcards automatically. Cards are reviewed using the SM2 spaced repetition algorithm with flip animations, text-to-speech pronunciation, and speech recognition for speaking practice.

## Features

- AI flashcard extraction from raw Spanish text via Claude API
- SM2 spaced repetition algorithm
- Animated card flip with text-to-speech and speech recognition (Web Speech API)
- Progress tracking: daily count, activity streaks, review calendar
- Falls back to mock data without a Supabase connection

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI | Claude API (Anthropic) via local proxy |
| Speech | Web Speech API (Chrome/Edge) |

## Running Locally

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Anthropic API key and (optionally) Supabase credentials

# Start the app and Claude proxy
npm run dev:all
```

Open http://localhost:5173 in Chrome or Edge (required for speech recognition).

## Claude API Integration

The Anthropic API doesn't allow direct browser requests (CORS), so a lightweight Express proxy (`server.js`) runs on port 3001 and forwards requests server-side.

1. Paste Spanish text and click "Extraer Frases con AI"
2. Frontend sends the text to `localhost:3001/api/claude`
3. Proxy forwards to `api.anthropic.com/v1/messages`
4. Claude returns structured flashcard data (phrase, translation, example sentence)
5. Cards are saved and become immediately reviewable

The prompt instructs Claude to extract natural phrases rather than isolated vocabulary, prioritising items useful for conversational Spanish.
