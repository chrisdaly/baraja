# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**baraja** - A Spanish language learning flashcard app with voice recognition and text-to-speech features. Built with React, Vite, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend**: React 18, Vite 5
- **Styling**: Tailwind CSS with custom Spanish theme
- **Database**: Supabase (PostgreSQL) with fallback to mock data
- **APIs**: Web Speech API (SpeechSynthesis + SpeechRecognition)
- **Fonts**: Google Fonts (Caveat, Fredoka One, Permanent Marker, Indie Flower)

## Project Structure

```
src/
├── components/
│   ├── Background.jsx          # Málaga cityscape SVG background
│   ├── Flashcard.jsx           # Main flashcard with flip animation
│   ├── Header.jsx              # App header with Spanish theme
│   ├── ProgressBar.jsx         # Daily progress indicator
│   ├── RecognitionFeedback.jsx # Speech recognition feedback modal
│   └── StatsBar.jsx            # Stats display (today, streak, total)
├── hooks/
│   ├── useFlashcards.js        # Supabase integration for cards CRUD
│   ├── useSpeechRecognition.js # Speech recognition hook
│   └── useTextToSpeech.js      # Text-to-speech hook
├── lib/
│   ├── mockData.js             # Fallback flashcard data
│   └── supabase.js             # Supabase client configuration
├── App.jsx                     # Main app component
├── index.css                   # Global styles & Tailwind imports
└── main.jsx                    # React entry point
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Supabase Setup

### Option 1: Use Mock Data (Default)
The app works without Supabase using mock data from `src/lib/mockData.js`.

### Option 2: Configure Supabase
1. Create a Supabase project at https://supabase.com
2. Create the database schema:

```sql
-- Cards table
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spanish TEXT NOT NULL,
  english TEXT NOT NULL,
  examples JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking (optional, for future)
CREATE TABLE user_card_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  card_id UUID REFERENCES cards,
  status TEXT CHECK (status IN ('new', 'learning', 'known')),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);
```

3. Copy `.env.example` to `.env` and add your credentials:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Features & Architecture

### Flashcard System
- **Data Source**: Supabase (if configured) or mock data fallback
- **Spaced Repetition**: Review queue for cards marked "todavía no"
- **Progress Tracking**: Daily count, streak, and completion percentage

### Voice Features
- **Text-to-Speech**: Native Web Speech API (Spanish voice, 0.85x rate)
- **Speech Recognition**: Webkit SpeechRecognition with similarity matching
- **Similarity Algorithm**: Word-level matching (60% threshold for success)

### Styling Approach
- **Tailwind Custom Theme**: Spanish flag colors, wood tones, paper textures
- **Custom Utilities**: Noise texture, swipe animations
- **CSS-in-JS**: Minimal inline styles for dynamic values
- **Responsive**: Mobile-first design, max-width 420px

### State Management
- **Local State**: React hooks (useState, useEffect)
- **Custom Hooks**: Separate concerns (data, speech, recognition)
- **No Global State**: Simple component prop passing

## Browser Requirements

- **Best Experience**: Chrome/Edge (full speech recognition support)
- **Fallback**: Firefox/Safari (TTS works, recognition may be limited)
- **Required**: Modern CSS (transforms, backdrop-filter, animations)

## Adding New Flashcards

### With Supabase:
Use Supabase dashboard or call `addCard()` from `useFlashcards` hook:
```javascript
const { addCard } = useFlashcards();
addCard({
  spanish: "hacer puente",
  english: "to take a long weekend",
  examples: ["Voy a hacer puente.", "Hacemos puente este viernes.", "¿Haces puente?"]
});
```

### Without Supabase:
Add to `src/lib/mockData.js`:
```javascript
{
  id: '9',
  spanish: 'hacer puente',
  english: 'to take a long weekend',
  examples: ['Voy a hacer puente.', 'Hacemos puente este viernes.', '¿Haces puente?'],
}
```

## Design Philosophy

- **Spanish Theme**: Red/yellow colors, Málaga background, playful fonts
- **Aged Paper Aesthetic**: Noise textures, ornate corners, subtle gradients
- **Playful UX**: Emoji icons, swipe animations, handwritten fonts
- **Accessibility**: High contrast, clear typography, visual feedback

## Common Tasks

### Update Spanish Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  spanish: { red: '#c60b1e', yellow: '#ffc400' },
  // ...
}
```

### Modify Card Flip Animation
Edit `Flashcard.jsx` transform and transition durations

### Change Speech Recognition Threshold
Edit `useSpeechRecognition.js` (currently 0.6 / 60% match required)

### Add New Component
1. Create in `src/components/`
2. Import Google Fonts if using custom fonts
3. Use Tailwind utilities + custom theme colors
4. Include noise texture for paper effect: `className="noise-texture opacity-[0.03]"`
