# Database Management Guide

## Quick Links

### Your Supabase Project
- **Dashboard**: https://supabase.com/dashboard/project/uhmdckurbsbmtlmkiahf
- **SQL Editor**: https://supabase.com/dashboard/project/uhmdckurbsbmtlmkiahf/sql

## How to Run SQL Files

### Method 1: Copy & Paste (Easiest)
1. Open the SQL file in your code editor
2. Select all (Cmd+A) and copy
3. Go to [SQL Editor](https://supabase.com/dashboard/project/uhmdckurbsbmtlmkiahf/sql)
4. Click "New Query"
5. Paste and click "Run" (or Cmd+Enter)

### Method 2: Via Supabase CLI (Advanced)
```bash
# Install Supabase CLI (if not already installed)
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref uhmdckurbsbmtlmkiahf

# Run SQL file
supabase db execute --file supabase-setup.sql
```

## SQL Files in This Project

### Initial Setup
**File**: `supabase-setup.sql`
- Creates `cards` table
- Creates `user_card_progress` table (for future)
- Sets up Row Level Security policies
- Inserts initial 8 flashcards
- **Run this first!**

### Activity Tracking
**File**: `supabase-activity-tracking.sql`
- Creates `daily_activity` table
- Creates `monthly_achievements` table
- Enables activity calendar and streak tracking
- **Run this after initial setup**

### Add More Cards
**File**: `supabase-add-more-cards.sql`
- Adds 7 additional flashcards (cards 9-15)
- Total: 15 cards after running
- **Run this to test the 10-card daily goal**

## Database Schema

### Tables

#### `cards`
Stores all flashcard data
```sql
- id (UUID, primary key)
- spanish (TEXT) - Spanish phrase
- english (TEXT) - English translation
- examples (JSONB) - Array of example sentences with translations
- created_at (TIMESTAMP)
```

#### `daily_activity`
Tracks daily practice for calendar/streaks
```sql
- id (UUID, primary key)
- date (DATE, unique) - The practice date
- cards_reviewed (INTEGER) - Total cards reviewed
- cards_learned (INTEGER) - Cards marked as "known"
- is_complete (BOOLEAN) - True when cards_learned >= 10
- created_at, updated_at (TIMESTAMP)
```

#### `monthly_achievements`
Records perfect months (all days completed)
```sql
- id (UUID, primary key)
- month (DATE, unique) - First day of the month
- days_completed (INTEGER)
- days_in_month (INTEGER)
- is_perfect (BOOLEAN) - True when all days completed
- created_at (TIMESTAMP)
```

#### `user_card_progress` (Future Use)
For tracking individual user progress per card
```sql
- id (UUID, primary key)
- user_id (UUID) - References auth.users
- card_id (UUID) - References cards
- status (TEXT) - 'new', 'learning', or 'known'
- last_reviewed, next_review (TIMESTAMP)
- review_count (INTEGER)
- created_at (TIMESTAMP)
```

## Common SQL Operations

### Add a New Card
```sql
INSERT INTO cards (spanish, english, examples) VALUES
(
  'echar una mano',
  'to lend a hand / to help out',
  '[
    {"spanish": "¿Me echas una mano?", "english": "Can you lend me a hand?"},
    {"spanish": "Te echo una mano.", "english": "I''ll help you out."},
    {"spanish": "Necesito que me eches una mano.", "english": "I need you to help me out."}
  ]'::jsonb
);
```

### View All Cards
```sql
SELECT spanish, english FROM cards ORDER BY created_at;
```

### Count Total Cards
```sql
SELECT COUNT(*) as total FROM cards;
```

### View Recent Activity
```sql
SELECT date, cards_reviewed, cards_learned, is_complete
FROM daily_activity
ORDER BY date DESC
LIMIT 30;
```

### Check Monthly Achievements
```sql
SELECT month, days_completed, days_in_month, is_perfect
FROM monthly_achievements
ORDER BY month DESC;
```

### Update a Card
```sql
UPDATE cards
SET
  spanish = 'nuevo texto',
  english = 'new text'
WHERE id = 'card-uuid-here';
```

### Delete a Card
```sql
DELETE FROM cards WHERE id = 'card-uuid-here';
```

## Row Level Security (RLS)

All tables have RLS enabled with public read/write access. When you add authentication later, you can restrict access:

### Example: Restrict to Authenticated Users Only
```sql
-- Drop existing public policies
DROP POLICY "Allow public read access to cards" ON cards;

-- Create authenticated-only policy
CREATE POLICY "Allow authenticated users to read cards"
  ON cards FOR SELECT
  TO authenticated
  USING (true);
```

## Backup Your Data

### Export Cards as JSON
```sql
COPY (
  SELECT json_agg(cards)
  FROM cards
) TO '/tmp/cards-backup.json';
```

### Via Supabase Dashboard
1. Go to Table Editor
2. Select the `cards` table
3. Click "..." menu → "Download as CSV"

## Tips

- **Always test SQL in a dev environment first** if you have one
- **Use transactions** for multiple related operations:
  ```sql
  BEGIN;
  -- your operations here
  COMMIT;  -- or ROLLBACK; if something went wrong
  ```
- **Check query results** before running DELETE or UPDATE operations:
  ```sql
  -- First, check what will be affected
  SELECT * FROM cards WHERE spanish LIKE '%test%';

  -- Then delete if correct
  DELETE FROM cards WHERE spanish LIKE '%test%';
  ```

## Environment Variables

Make sure your `.env` file has the correct credentials:
```bash
VITE_SUPABASE_URL=https://uhmdckurbsbmtlmkiahf.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

These are already configured in your project, but keep them secret!

## Troubleshooting

### "relation does not exist"
- You haven't run the schema SQL files yet
- Run `supabase-setup.sql` first

### "permission denied"
- RLS policies might be blocking access
- Check policies in Supabase Dashboard → Authentication → Policies

### "duplicate key value violates unique constraint"
- You're trying to insert data that already exists
- Check for unique constraints (date in daily_activity, month in monthly_achievements)

### Changes not showing in app
- Restart your dev server: `npm run dev`
- Clear browser cache
- Check browser console for errors

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- Your project's SQL Editor includes AI assistance and query examples
