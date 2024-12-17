export type BibleBook = typeof BOOKS_OF_THE_BIBLE[number];

export interface RawVerse {
  book: BibleBook;
  chapter: number;
  verse: number;
  text: string;
}

export interface Verse extends RawVerse {
  id: number;
  reference: string;
}

export interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface CrossReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  source_reference: string;
  target_reference: string;
  connection_type: 'parallel' | 'quotation' | 'allusion' | 'thematic';
  confidence: number;
}

export interface Bookmark {
  id: string;
  text: string;
  reference: string;
  createdAt: number;
}