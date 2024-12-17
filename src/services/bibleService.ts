import { db } from '../utils/db';
import type { SearchResult, Verse, CrossReference } from '../types/bible';
import { parseReference } from '../utils/bibleReferences';

export const bibleService = {
  async searchVerses(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.trim();
    const reference = parseReference(normalizedQuery);
    
    try {
      console.log('Search query:', normalizedQuery);
      console.log('Parsed reference:', reference);
      
      if (reference) {
        console.log('Performing reference search for:', reference);
        // Exact reference search
        const verse = await db.getVerse(reference.book, reference.chapter, reference.verse);
        if (verse) {
          return [{
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text
          }];
        }
        return [];
      }
      
      // Text search
      console.log('Performing text search for:', normalizedQuery);
      const verses = await db.searchVerses(normalizedQuery);
      return verses.map(verse => ({
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text
      }));
      
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },
  
  async getCrossReferences(reference: string): Promise<CrossReference[]> {
    // This feature will be implemented in a future update
    console.log('Cross references requested for:', reference);
    return [];
  }
};