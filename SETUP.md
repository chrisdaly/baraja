# Setup Guide

## 🚀 Quick Start (Local Development)

The app works out of the box with mock data!

```bash
npm install
npm run dev
```

Open http://localhost:5173 - you'll see the app with 8 Spanish flashcards.

## 📦 What Was Built

Your vanilla HTML/CSS/JS app has been ported to a modern React stack:

### ✅ Complete Migration
- ✨ React 18 + Vite setup
- 🎨 Tailwind CSS with custom Spanish theme
- 🔧 Modular component architecture
- 🎣 Custom hooks for speech features
- 💾 Supabase integration (optional)
- 📱 Responsive design maintained
- 🎭 All animations and styling preserved

### 📁 New Structure
```
baraja/
├── src/
│   ├── components/     # 6 React components
│   ├── hooks/          # 3 custom hooks
│   ├── lib/            # Supabase + mock data
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html          # New Vite entry point
├── index-original.html # Your original file (preserved)
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🗄️ Supabase Setup (Optional)

### When to set up Supabase:
- You want to add/edit flashcards dynamically
- You want user progress tracking
- You want to sync data across devices

### How to set up:

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project

2. **Run SQL Schema**
   - Open SQL Editor in Supabase
   - Copy the schema from CLAUDE.md (lines 66-86)
   - Execute the SQL

3. **Add Environment Variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Restart Dev Server**
   ```bash
   npm run dev
   ```

### Adding Cards to Supabase

Use the Supabase dashboard or SQL:

```sql
INSERT INTO cards (spanish, english, examples) VALUES
('hacer puente', 'to take a long weekend',
 '["Voy a hacer puente.", "Hacemos puente este viernes.", "¿Haces puente?"]');
```

## 🎨 Customization

### Add New Flashcards (Without Supabase)
Edit `src/lib/mockData.js`:
```javascript
{
  id: '9',
  spanish: 'hacer puente',
  english: 'to take a long weekend',
  examples: ['...', '...', '...'],
}
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
spanish: {
  red: '#c60b1e',
  yellow: '#ffc400',
}
```

### Modify Speech Recognition Threshold
Edit `src/hooks/useSpeechRecognition.js`:
```javascript
success: similarity > 0.6, // Change 0.6 to adjust strictness
```

## 📱 Browser Support

**Best Experience:**
- Chrome/Edge (full speech recognition)

**Partial Support:**
- Firefox (TTS only, no speech recognition)
- Safari (TTS only, no speech recognition)

## 🏗️ Build for Production

```bash
npm run build
npm run preview  # Test production build locally
```

Deploys to `dist/` folder - ready for Netlify, Vercel, etc.

## 🤔 Need Help?

- Architecture details: See `CLAUDE.md`
- Database schema: See `CLAUDE.md` (Supabase Setup section)
- Component docs: Each file has inline comments
