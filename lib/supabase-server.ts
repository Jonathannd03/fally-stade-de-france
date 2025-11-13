import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
// This bypasses Row Level Security and should only be used in API routes

// Use placeholder values during build if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

if (
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseServiceKey === 'placeholder-key'
) {
  console.warn('Missing Supabase service role credentials. Admin authentication will not work.');
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
