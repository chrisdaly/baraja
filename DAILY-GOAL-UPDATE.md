# Daily Goal System - 10 Cards Per Day

## What Changed

### 🎯 Daily Goal: 10 Cards
- You now need to **mark 10 cards as "known"** (✓ ¡ya está!) to complete your day
- Calendar squares turn red/yellow only after hitting the 10-card goal
- Progress bar now shows "meta diaria (10 tarjetas)"

### 🎉 Congratulations Modal
- When you hit 10 learned cards, a celebration modal appears
- Features:
  - Bouncing trophy emoji 🏆
  - "¡Felicidades!" message
  - Animated Spanish flag colors
  - Two options:
    - **Continuar practicando** - Keep going, learn more!
    - **Volver al inicio** - Go back to home screen

### 📊 Smart Tracking
- **Cards Reviewed** - Total cards you've looked at (both buttons)
- **Cards Learned** - Only counts cards you marked as "known" (✓)
- Day completes only when you reach 10 learned cards
- You can practice beyond 10 cards - modal only shows once per day

### 🏆 Monthly Achievement
- Complete 10 cards **every day** for a month
- Earn a Spanish flag trophy badge
- Badge displays at top of calendar with month name

## How It Works

1. **Start Practice** - From home screen
2. **Review Cards** - Swipe through your flashcards
3. **Mark as Known** - Click "¡ya está!" when you know it
4. **Hit Goal** - After 10 cards, congratulations modal appears!
5. **Choose Path**:
   - Continue practicing for extra review
   - Go home to see your updated calendar
6. **Calendar Updates** - Day turns red/yellow on the calendar

## Progress Bar Logic

**Before:** Progress = reviewed / total cards in deck
**Now:** Progress = learned cards / 10

Example:
- 3 cards learned → 30% progress
- 10 cards learned → 100% progress ✅

## Stats Display

### Home Screen
- **Racha actual** - Consecutive days with 10+ cards
- **Hoy** - Cards reviewed today
- **Aprendidas** - Cards learned today (towards the 10 goal)

### Practice View
- **hoy** - Cards reviewed in current session
- **racha** - Current streak
- **total** - Total cards in your deck

## Files Updated

### New Files
- `src/components/DailyGoalModal.jsx` - Celebration modal
- `DAILY-GOAL-UPDATE.md` - This documentation

### Modified Files
- `src/hooks/useDailyActivity.js` - Changed completion logic to 10 cards
- `src/App.jsx` - Added modal logic and goal tracking
- `src/components/ProgressBar.jsx` - Updated label
- `src/components/HomeScreen.jsx` - Updated motivational text
- `src/index.css` - Added fadeIn and scaleIn animations

## Database Schema

No changes needed! The existing schema already supports this:
- `cards_reviewed` - Tracks all cards reviewed
- `cards_learned` - Tracks cards marked as known
- `is_complete` - True when `cards_learned >= 10`

## Motivation System

### Daily Engagement
- Clear, achievable goal (10 cards)
- Immediate visual feedback (modal)
- Calendar provides long-term view

### Streak Building
- Encourages daily practice
- Visual streak counter with 🔥
- Breaks if you miss a day

### Monthly Achievement
- Long-term goal (30-31 days)
- Rare reward (Spanish flag trophy)
- Visible badge of accomplishment

## User Flow

```
Home Screen
    ↓
Click "comenzar práctica"
    ↓
Review flashcards
    ↓
Mark 10 as "known"
    ↓
🎉 MODAL APPEARS 🎉
    ↓
Choose:
├── Continue → Keep practicing
└── Go Home → See updated calendar
```

## Testing Tips

To test the modal without learning 10 cards:
1. Open browser console
2. Type: `localStorage.clear()`
3. Refresh page
4. Quickly mark 10 cards as known

Or temporarily change `DAILY_GOAL` in `useDailyActivity.js` to `2` for testing.

## Future Enhancements

Potential ideas:
- Adjustable daily goal (5, 10, 20 cards)
- Different celebration messages
- Sound effects on completion
- Share achievement on social media
- Weekly/monthly summary stats
