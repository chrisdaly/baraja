# Home Screen & Activity Tracking Update

## What's New

### 🏠 Home Screen with Activity Calendar
- GitHub-style contribution calendar showing your daily practice
- Red and yellow squares for completed days (Spanish flag colors!)
- Stats showing current streak, today's progress, and cards learned
- Big green button to start practicing

### 🏆 Monthly Achievement Badges
- Complete every day of a month → earn a Spanish flag badge!
- Badges displayed at the top of the calendar
- Trophy emoji + month name on each badge

### 📊 Activity Tracking
- Automatically tracks daily usage
- Records cards reviewed vs cards learned
- Marks days as "complete" when you finish all cards
- Calculates your current streak

### 🔄 Navigation
- App now starts on the home screen
- Click "comenzar práctica" to start flashcards
- Back arrow (←) in top-left to return home anytime
- Practice session progress is preserved

## Database Setup Required

Run this SQL in your Supabase SQL Editor:

```bash
# Copy the file contents
cat supabase-activity-tracking.sql
```

This creates:
- `daily_activity` table - tracks your daily practice
- `monthly_achievements` table - records perfect months
- Proper RLS policies for public access

## How It Works

1. **Home Screen** - Shows your calendar and motivates daily practice
2. **Start Practice** - Click the button to begin flashcards
3. **Auto-Tracking** - As you mark cards "known" or "review", activity is saved
4. **Complete Day** - Finish all cards → day turns red/yellow on calendar
5. **Perfect Month** - Complete all days in a month → earn Spanish flag badge 🏆

## Features

### Calendar View
- Shows last 365 days of activity
- Alternates red/yellow for visual variety (Spanish flag!)
- Hover over squares to see details
- Week labels (D, L, M, X, J, V, S)

### Streak Calculation
- Counts consecutive days of completed practice
- Shown on home screen with fire emoji 🔥
- Resets if you miss a day

### Mock Data Fallback
- Works without Supabase (generates demo calendar)
- Seamless transition to real data once DB is set up
- Useful for development and demos

## Files Changed

### New Components
- `src/components/HomeScreen.jsx` - Main home screen with stats
- `src/components/ActivityCalendar.jsx` - GitHub-style calendar grid

### New Hooks
- `src/hooks/useDailyActivity.js` - Activity tracking and Supabase integration

### Updated Files
- `src/App.jsx` - Added view state and navigation
- Database schemas in `supabase-activity-tracking.sql`

## Next Steps

1. **Run the SQL** in Supabase to create the tables
2. **Restart dev server** - `npm run dev`
3. **Try it out** - You'll see the home screen first!
4. **Practice daily** - Build your streak and earn badges

## Future Enhancements

Potential ideas:
- Share your calendar on social media
- Export activity as CSV
- Set daily goals (e.g., "review 20 cards")
- Reminder notifications
- Custom themes for calendar colors
- Compare streaks with friends
