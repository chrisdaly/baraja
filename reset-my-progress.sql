-- ============================================
-- Reset Progress - Make All Cards New Again
-- ============================================
-- This will delete all your review progress
-- and make all cards appear as "new" cards
-- ============================================

DELETE FROM user_card_progress
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Verify it worked
SELECT COUNT(*) as remaining_progress_records
FROM user_card_progress
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Check how many cards you have
SELECT COUNT(*) as total_cards FROM cards;

-- After running this, refresh your app and all cards should be available!
