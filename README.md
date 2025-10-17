# baraja

A Spanish language learning flashcard app with voice recognition and text-to-speech features.

## Features

- 🎴 Interactive flashcards with flip animations
- 🔊 Text-to-speech for Spanish pronunciation
- 🎤 Speech recognition to practice speaking
- 📊 Progress tracking (daily count, streak, activity calendar)
- 🔄 Spaced repetition system (SM2 algorithm)
- 🎨 Beautiful Spanish-themed design (Málaga cityscape)
- 💾 Supabase integration (optional) with local fallback
- 🤖 AI-powered flashcard extraction from Spanish text (Claude API)
- ⚙️ Admin page to manually add cards or extract with AI

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser (Chrome/Edge recommended for full speech recognition support).

### Using AI Flashcard Extraction

To use the AI-powered flashcard extraction feature:

1. Add your Anthropic API key to `.env`:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

2. Start both the frontend and proxy server:
   ```bash
   # In one terminal
   npm run server

   # In another terminal
   npm run dev

   # OR run both together
   npm run dev:all
   ```

3. Click the ⚙️ settings icon on the home screen
4. Switch to "AI Extraction" mode
5. Paste Spanish text and click "Extraer Frases con AI"

**Note**: The AI extraction requires a local proxy server (`server.js`) to avoid CORS issues with the Anthropic API.

## Setup with Supabase (Optional)

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `CLAUDE.md`
3. Copy `.env.example` to `.env`
4. Add your Supabase credentials to `.env`

The app works without Supabase using mock data.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Supabase (PostgreSQL)
- Web Speech API

## Development

See `CLAUDE.md` for detailed architecture and development guide.
