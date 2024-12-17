-- Enable full-text search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verses table
CREATE TABLE IF NOT EXISTS verses (
  id SERIAL PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  translation_id TEXT NOT NULL DEFAULT 'kjv',
  reference TEXT GENERATED ALWAYS AS (book || ' ' || chapter::TEXT || ':' || verse::TEXT) STORED,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', book), 'A') ||
    setweight(to_tsvector('english', text), 'B')
  ) STORED,
  UNIQUE(book, chapter, verse, translation_id)
);

-- Cross references table
CREATE TABLE IF NOT EXISTS cross_references (
  id SERIAL PRIMARY KEY,
  source_reference TEXT NOT NULL,
  target_reference TEXT NOT NULL,
  connection_type TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  UNIQUE(source_reference, target_reference)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verses_reference ON verses(reference);
CREATE INDEX IF NOT EXISTS idx_verses_search ON verses USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_verses_trgm ON verses USING gin(text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cross_refs_source ON cross_references(source_reference);
CREATE INDEX IF NOT EXISTS idx_cross_refs_target ON cross_references(target_reference);