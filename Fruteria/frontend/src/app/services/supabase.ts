import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/** Whether both required env vars are present and look well-formed. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This app has no login/session flow, so we don't need Supabase Auth's
    // client-side session persistence or the background token-refresh calls
    // it schedules by default. Keeping this off avoids unused localStorage
    // entries and network activity for a store that only uses the anon key.
    persistSession: false,
    autoRefreshToken: false,
  },
});
