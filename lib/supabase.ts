import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Vote = {
  id: string;
  song_id: string;
  user_id: string;
  created_at: string;
};

export type SongVoteCount = {
  song_id: string;
  vote_count: number;
};

export type AdminUser = {
  id: string;
  username: string;
  password_hash: string;
  email: string | null;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
