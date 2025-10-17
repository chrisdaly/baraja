# baraja

A Spanish language learning flashcard app with voice recognition and text-to-speech features.

## Features

- 🎴 Interactive flashcards with flip animations
- 🔊 Text-to-speech for Spanish pronunciation
- 🎤 Speech recognition to practice speaking
- 📊 Progress tracking (daily count, streak)
- 🔄 Spaced repetition system
- 🎨 Beautiful Spanish-themed design (Málaga cityscape)
- 💾 Supabase integration (optional) with local fallback

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser (Chrome/Edge recommended for full speech recognition support).

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
