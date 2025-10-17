-- Fix RLS policy for cards table to allow public insert
-- Run this in Supabase SQL Editor

-- Drop the old policy that required authentication
DROP POLICY IF EXISTS "Authenticated users can insert cards" ON cards;

-- Create new policy that allows public insert
CREATE POLICY "Allow public insert to cards"
  ON cards FOR INSERT
  TO public
  WITH CHECK (true);

-- Also allow public update (for editing cards in admin)
DROP POLICY IF EXISTS "Allow public update to cards" ON cards;

CREATE POLICY "Allow public update to cards"
  ON cards FOR UPDATE
  TO public
  USING (true);

-- Allow public delete (for removing cards in admin if needed)
DROP POLICY IF EXISTS "Allow public delete from cards" ON cards;

CREATE POLICY "Allow public delete from cards"
  ON cards FOR DELETE
  TO public
  USING (true);
