-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL
);

-- Create verses table with full-text search
CREATE TABLE IF NOT EXISTS verses (
  id SERIAL PRIMARY KEY,
  book VARCHAR(50) NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  translation_id INTEGER NOT NULL REFERENCES translations(id),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', book), 'A') ||
    setweight(to_tsvector('english', text), 'B')
  ) STORED
);

-- Create indexes
CREATE INDEX IF NOT EXISTS verses_search_idx ON verses USING gin(search_vector);
CREATE INDEX IF NOT EXISTS verses_reference_idx ON verses (book, chapter, verse);

-- Insert KJV translation if it doesn't exist
INSERT INTO translations (name, full_name)
VALUES ('KJV', 'King James Version')
ON CONFLICT (name) DO NOTHING;
