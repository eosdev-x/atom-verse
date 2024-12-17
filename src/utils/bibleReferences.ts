import { BOOKS_OF_THE_BIBLE } from '../constants/bible';

interface ParsedReference {
  book: string;
  chapter: number;
  verse: number;
}

export function parseReference(input: string): ParsedReference | null {
  // Handle common formats: "John 3:16", "1 John 2:3", etc.
  const match = input.match(/^(\d?\s*\w+)\s*(\d+):(\d+)$/i);
  
  if (!match) return null;
  
  const [, bookPart, chapter, verse] = match;
  const normalizedBook = bookPart.trim();
  
  // Find matching book
  const book = BOOKS_OF_THE_BIBLE.find(b => 
    b.toLowerCase() === normalizedBook.toLowerCase() ||
    b.toLowerCase().includes(normalizedBook.toLowerCase())
  );
  
  if (!book) return null;
  
  const chapterNum = parseInt(chapter, 10);
  const verseNum = parseInt(verse, 10);
  
  if (isNaN(chapterNum) || isNaN(verseNum)) return null;
  
  return {
    book,
    chapter: chapterNum,
    verse: verseNum
  };
}