import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockFlashcards } from '../lib/mockData';

export default function useFlashcards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        // Load from Supabase
        const { data, error: supabaseError } = await supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: true });

        if (supabaseError) throw supabaseError;
        setCards(data || []);
      } else {
        // Use mock data when Supabase is not configured
        console.log('⚠️ Supabase not configured, using mock data');
        setCards(mockFlashcards);
      }
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError(err.message);
      // Fallback to mock data on error
      setCards(mockFlashcards);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot add cards');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([cardData])
        .select()
        .single();

      if (error) throw error;

      setCards((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding card:', err);
      setError(err.message);
      return null;
    }
  };

  const updateCard = async (id, updates) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot update cards');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCards((prev) => prev.map((card) => (card.id === id ? data : card)));
      return data;
    } catch (err) {
      console.error('Error updating card:', err);
      setError(err.message);
      return null;
    }
  };

  const deleteCard = async (id) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot delete cards');
      return false;
    }

    try {
      const { error } = await supabase.from('cards').delete().eq('id', id);

      if (error) throw error;

      setCards((prev) => prev.filter((card) => card.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting card:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    reload: loadCards,
  };
}
