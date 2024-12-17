import { BOOKS_OF_THE_BIBLE } from '../constants/bible';
import type { RawVerse } from '../types/bible';

export function validateVerse(verse: RawVerse): string | null {
  if (!verse.book || !BOOKS_OF_THE_BIBLE.includes(verse.book)) {
    return `Invalid book: ${verse.book}`;
  }
  
  if (!Number.isInteger(verse.chapter) || verse.chapter < 1) {
    return `Invalid chapter number: ${verse.chapter}`;
  }
  
  if (!Number.isInteger(verse.verse) || verse.verse < 1) {
    return `Invalid verse number: ${verse.verse}`;
  }
  
  if (!verse.text || verse.text.trim().length === 0) {
    return 'Empty verse text';
  }
  
  return null;
}