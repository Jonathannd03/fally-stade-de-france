-- Create the votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(song_id, user_id) -- One vote per song per user
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_votes_song_id ON votes(song_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Enable Row Level Security
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read votes
CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert votes
CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to delete their own votes
CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE USING (true);

-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable Row Level Security for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access admin_users (no public access)
CREATE POLICY "Service role can access admin_users" ON admin_users
  USING (false);

-- Add a comment to the table
COMMENT ON TABLE admin_users IS 'Stores admin user credentials with hashed passwords';
COMMENT ON COLUMN admin_users.password_hash IS 'bcrypt hashed password';
COMMENT ON COLUMN admin_users.is_active IS 'Whether the admin account is active';
