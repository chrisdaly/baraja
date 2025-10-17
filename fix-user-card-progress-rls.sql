-- Fix RLS policy for user_card_progress table
-- This allows unauthenticated users to insert/update/delete progress records

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can manage their own progress" ON user_card_progress;

-- Create new policies that allow public access
CREATE POLICY "Allow public insert to user_card_progress"
  ON user_card_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to user_card_progress"
  ON user_card_progress FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete from user_card_progress"
  ON user_card_progress FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public select from user_card_progress"
  ON user_card_progress FOR SELECT
  TO public
  USING (true);
