import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Mock user ID for testing (in production, use actual auth)
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

export default function useSRS() {
  const [dueCards, setDueCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    reviewed: 0,
    newCards: 0,
  });

  useEffect(() => {
    loadDueCards();
  }, []);

  const loadDueCards = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase not configured, SRS not available');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Get cards due for review using the SQL function
      const { data, error } = await supabase.rpc('get_due_cards', {
        user_uuid: MOCK_USER_ID,
      });

      if (error) throw error;

      console.log('📚 SRS loaded:', data?.length || 0, 'cards due');
      setDueCards(data || []);
    } catch (err) {
      console.error('Error loading SRS cards:', err);
      setDueCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewCard = useCallback(async (cardId, quality) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot update SRS');
      return null;
    }

    try {
      // Call the SQL function to update card review
      const { data, error } = await supabase.rpc('update_card_review', {
        p_card_id: cardId,
        p_user_id: MOCK_USER_ID,
        p_quality: quality,
        p_status: quality >= 2 ? 'learning' : 'new',
      });

      if (error) throw error;

      console.log('✅ Card reviewed:', {
        quality,
        nextInterval: data.interval_days,
        nextReview: new Date(data.next_review).toLocaleDateString(),
      });

      // Update stats
      setTodayStats(prev => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        newCards: prev.newCards + (quality >= 2 ? 1 : 0),
      }));

      // Move to next card
      if (currentCardIndex < dueCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // Reload cards when we're done
        await loadDueCards();
        setCurrentCardIndex(0);
      }

      return data;
    } catch (err) {
      console.error('Error reviewing card:', err);
      return null;
    }
  }, [currentCardIndex, dueCards.length, loadDueCards]);

  const getCurrentCard = useCallback(() => {
    if (dueCards.length === 0 || currentCardIndex >= dueCards.length) {
      return null;
    }
    return dueCards[currentCardIndex];
  }, [dueCards, currentCardIndex]);

  const getProgress = useCallback(() => {
    if (dueCards.length === 0) return 100;
    return Math.round(((currentCardIndex + 1) / dueCards.length) * 100);
  }, [dueCards.length, currentCardIndex]);

  return {
    currentCard: getCurrentCard(),
    dueCards,
    loading,
    reviewCard,
    reload: loadDueCards,
    progress: getProgress(),
    todayStats,
    cardsRemaining: Math.max(0, dueCards.length - currentCardIndex - 1),
  };
}
