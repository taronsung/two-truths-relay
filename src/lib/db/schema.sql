-- Two Truths Relay Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chains table (each relay instance)
CREATE TABLE chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(12) UNIQUE NOT NULL,
  title VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_device_id VARCHAR(100) NOT NULL,
  privacy VARCHAR(20) DEFAULT 'link_only' CHECK (privacy IN ('link_only', 'public', 'private'))
);

-- Create index on slug for fast lookups
CREATE INDEX idx_chains_slug ON chains(slug);

-- Nodes table (each 2T1L contribution)
CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chain_id UUID NOT NULL REFERENCES chains(id) ON DELETE CASCADE,
  parent_node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
  parent_guess_choice CHAR(1) CHECK (parent_guess_choice IN ('A', 'B', 'C')),
  creator_device_id VARCHAR(100) NOT NULL,
  creator_name VARCHAR(50),
  creator_avatar VARCHAR(10),
  statement_a TEXT NOT NULL CHECK (LENGTH(statement_a) >= 5 AND LENGTH(statement_a) <= 200),
  statement_b TEXT NOT NULL CHECK (LENGTH(statement_b) >= 5 AND LENGTH(statement_b) <= 200),
  statement_c TEXT NOT NULL CHECK (LENGTH(statement_c) >= 5 AND LENGTH(statement_c) <= 200),
  lie_choice CHAR(1) NOT NULL CHECK (lie_choice IN ('A', 'B', 'C')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'removed', 'flagged'))
);

-- Create indexes for common queries
CREATE INDEX idx_nodes_chain ON nodes(chain_id);
CREATE INDEX idx_nodes_parent ON nodes(parent_node_id);
CREATE INDEX idx_nodes_status ON nodes(status);

-- Guesses table (each attempt at a node)
CREATE TABLE guesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  guesser_device_id VARCHAR(100) NOT NULL,
  choice CHAR(1) NOT NULL CHECK (choice IN ('A', 'B', 'C')),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(node_id, guesser_device_id)
);

-- Create index for lookups
CREATE INDEX idx_guesses_node ON guesses(node_id);

-- Events table (activity feed)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chain_id UUID NOT NULL REFERENCES chains(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('invite_opened', 'guess_submitted', 'node_created', 'node_reported')),
  actor_device_id VARCHAR(100),
  node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for activity feed queries
CREATE INDEX idx_events_chain ON events(chain_id);
CREATE INDEX idx_events_created ON events(created_at DESC);

-- Reports table (for moderation)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chain_id UUID REFERENCES chains(id) ON DELETE SET NULL,
  node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
  reporter_device_id VARCHAR(100) NOT NULL,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('harassment', 'spam', 'inappropriate', 'other')),
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for moderation queue
CREATE INDEX idx_reports_status ON reports(status);

-- Row Level Security (RLS) policies
ALTER TABLE chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Public read access for active chains
CREATE POLICY "Public can read active chains"
  ON chains FOR SELECT
  USING (privacy = 'link_only' OR privacy = 'public');

-- Anyone can create chains
CREATE POLICY "Anyone can create chains"
  ON chains FOR INSERT
  WITH CHECK (true);

-- Public read access for active nodes
CREATE POLICY "Public can read active nodes"
  ON nodes FOR SELECT
  USING (status = 'active');

-- Anyone can create nodes
CREATE POLICY "Anyone can create nodes"
  ON nodes FOR INSERT
  WITH CHECK (true);

-- Creators can update their own nodes
CREATE POLICY "Creators can update own nodes"
  ON nodes FOR UPDATE
  USING (creator_device_id = current_setting('app.device_id', true))
  WITH CHECK (creator_device_id = current_setting('app.device_id', true));

-- Public can read guesses
CREATE POLICY "Public can read guesses"
  ON guesses FOR SELECT
  USING (true);

-- Anyone can create guesses
CREATE POLICY "Anyone can create guesses"
  ON guesses FOR INSERT
  WITH CHECK (true);

-- Public can read events
CREATE POLICY "Public can read events"
  ON events FOR SELECT
  USING (true);

-- Anyone can create events
CREATE POLICY "Anyone can create events"
  ON events FOR INSERT
  WITH CHECK (true);

-- Anyone can create reports
CREATE POLICY "Anyone can create reports"
  ON reports FOR INSERT
  WITH CHECK (true);

-- Helper function to get tree data
CREATE OR REPLACE FUNCTION get_chain_tree(chain_slug VARCHAR)
RETURNS TABLE (
  id UUID,
  parent_node_id UUID,
  parent_guess_choice CHAR(1),
  creator_name VARCHAR(50),
  creator_avatar VARCHAR(10),
  statement_a TEXT,
  statement_b TEXT,
  statement_c TEXT,
  lie_choice CHAR(1),
  created_at TIMESTAMPTZ,
  guess_count BIGINT,
  correct_guess_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.parent_node_id,
    n.parent_guess_choice,
    n.creator_name,
    n.creator_avatar,
    n.statement_a,
    n.statement_b,
    n.statement_c,
    n.lie_choice,
    n.created_at,
    COUNT(g.id) as guess_count,
    COUNT(CASE WHEN g.is_correct THEN 1 END) as correct_guess_count
  FROM nodes n
  JOIN chains c ON n.chain_id = c.id
  LEFT JOIN guesses g ON n.id = g.node_id
  WHERE c.slug = chain_slug AND n.status = 'active'
  GROUP BY n.id
  ORDER BY n.created_at;
END;
$$ LANGUAGE plpgsql;
