-- Page Views Tracking Table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
-- Policy 1: Allow anyone to insert page views (for tracking)
CREATE POLICY "Enable insert access for all users" ON page_views
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Only allow reading page views via service role (admin only)
-- This means the analytics API will use the server-side client
CREATE POLICY "Enable read access for service role only" ON page_views
  FOR SELECT
  USING (false); -- No public reads, only via service role

-- Add a comment to the table
COMMENT ON TABLE page_views IS 'Tracks page views for analytics in the Fally Ipupa Setlist Voting app';
