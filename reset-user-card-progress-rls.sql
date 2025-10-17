-- Reset ALL RLS policies for user_card_progress table
-- This completely clears and recreates the policies

-- Drop ALL existing policies (including any old ones)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_card_progress')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON user_card_progress';
    END LOOP;
END $$;

-- Create fresh policies that allow public access
CREATE POLICY "Allow public insert to user_card_progress"
  ON user_card_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to user_card_progress"
  ON user_card_progress FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public select from user_card_progress"
  ON user_card_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public delete from user_card_progress"
  ON user_card_progress FOR DELETE
  TO public
  USING (true);

-- Verify RLS is enabled
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;

-- Show all policies (for verification)
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_card_progress';
