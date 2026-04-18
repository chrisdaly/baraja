import { createContext, useContext } from 'react';
import { isSupabaseConfigured } from './supabase';

export const DemoContext = createContext({ isDemo: false });

export function useDemoMode() {
  return useContext(DemoContext);
}

export function getIsDemo() {
  return !isSupabaseConfigured();
}
