-- ============================================
-- Activity Tracking for Daily Usage Calendar
-- Run this in Supabase SQL Editor
-- ============================================

-- Create daily_activity table to track usage
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  cards_reviewed INTEGER DEFAULT 0,
  cards_learned INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (you can restrict this later with auth)
CREATE POLICY "Allow public read access to daily_activity"
  ON daily_activity FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access to daily_activity"
  ON daily_activity FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to daily_activity"
  ON daily_activity FOR UPDATE
  TO public
  USING (true);

-- Create monthly_achievements table for tracking completed months
CREATE TABLE IF NOT EXISTS monthly_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month DATE NOT NULL UNIQUE, -- First day of the month
  days_completed INTEGER DEFAULT 0,
  days_in_month INTEGER NOT NULL,
  is_perfect BOOLEAN DEFAULT false, -- All days completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE monthly_achievements ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to monthly_achievements"
  ON monthly_achievements FOR SELECT
  TO public
  USING (true);

-- Allow public write access
CREATE POLICY "Allow public write access to monthly_achievements"
  ON monthly_achievements FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to monthly_achievements"
  ON monthly_achievements FOR UPDATE
  TO public
  USING (true);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_daily_activity_updated_at BEFORE UPDATE
    ON daily_activity FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Setup Complete!
-- ============================================
