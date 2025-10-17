import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function useDailyActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    reviewed: 0,
    learned: 0,
    isComplete: false,
  });

  useEffect(() => {
    loadActivities();
  }, []);

  // Debug: log activities when they change
  useEffect(() => {
    if (activities.length > 0) {
      console.log('📊 Activities loaded:', activities.length, 'entries');
      console.log('📊 Complete days:', activities.filter(a => a.is_complete).length);
      console.log('📊 Sample activity:', activities[0]);
    }
  }, [activities]);

  const loadActivities = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data for development
      const mockActivities = generateMockActivities();
      setActivities(mockActivities);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('daily_activity')
        .select('*')
        .order('date', { ascending: false })
        .limit(365);

      if (error) throw error;

      setActivities(data || []);

      // Get today's stats
      const today = new Date().toISOString().split('T')[0];
      const todayActivity = data?.find(a => a.date === today);

      if (todayActivity) {
        setTodayStats({
          reviewed: todayActivity.cards_reviewed,
          learned: todayActivity.cards_learned,
          isComplete: todayActivity.is_complete,
        });
      }
    } catch (err) {
      console.error('Error loading activities:', err);
      // Fallback to mock data
      const mockActivities = generateMockActivities();
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const updateTodayActivity = async (cardsReviewed, cardsLearned) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot update activity');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const DAILY_GOAL = 10;
    const isComplete = cardsLearned >= DAILY_GOAL;

    try {
      const { data, error } = await supabase
        .from('daily_activity')
        .upsert(
          {
            date: today,
            cards_reviewed: cardsReviewed,
            cards_learned: cardsLearned,
            is_complete: isComplete,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'date',
          }
        )
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setTodayStats({
        reviewed: cardsReviewed,
        learned: cardsLearned,
        isComplete,
      });

      // Update activities list
      setActivities(prev => {
        const filtered = prev.filter(a => a.date !== today);
        return [data, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      // Check for monthly achievement
      if (isComplete) {
        await checkMonthlyAchievement(today);
      }

      return data;
    } catch (err) {
      console.error('Error updating activity:', err);
      return null;
    }
  };

  const checkMonthlyAchievement = async (dateStr) => {
    if (!isSupabaseConfigured()) return;

    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();

      // Get all activities for this month
      const { data: monthActivities, error } = await supabase
        .from('daily_activity')
        .select('*')
        .gte('date', firstDayOfMonth.toISOString().split('T')[0])
        .lte('date', lastDayOfMonth.toISOString().split('T')[0])
        .eq('is_complete', true);

      if (error) throw error;

      const completedDays = monthActivities?.length || 0;

      // If all days are completed, record achievement
      if (completedDays === daysInMonth) {
        await supabase.from('monthly_achievements').upsert(
          {
            month: firstDayOfMonth.toISOString().split('T')[0],
            days_completed: completedDays,
            days_in_month: daysInMonth,
            is_perfect: true,
          },
          {
            onConflict: 'month',
          }
        );

        console.log('🏆 ¡Mes perfecto completado!');
      }
    } catch (err) {
      console.error('Error checking monthly achievement:', err);
    }
  };

  return {
    activities,
    loading,
    todayStats,
    updateTodayActivity,
    reload: loadActivities,
    DAILY_GOAL: 10,
  };
}

// Generate mock activities for development/demo
function generateMockActivities() {
  const activities = [];
  const today = new Date();

  // Generate last 60 days with some random completion
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 70% chance of completion for recent days
    const isComplete = Math.random() > 0.3;

    if (isComplete || Math.random() > 0.5) {
      activities.push({
        id: `mock-${i}`,
        date: date.toISOString().split('T')[0],
        cards_reviewed: Math.floor(Math.random() * 20) + 5,
        cards_learned: isComplete ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3),
        is_complete: isComplete,
        created_at: date.toISOString(),
      });
    }
  }

  return activities;
}
