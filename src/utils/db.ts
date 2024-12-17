interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

class LocalBibleDB {
  private cache: Map<string, BibleVerse[]> = new Map();

  async getVerses(book: string): Promise<BibleVerse[]> {
    // Check cache first
    if (this.cache.has(book)) {
      return this.cache.get(book)!;
    }

    try {
      // Load the book's JSON file from the public directory
      const response = await fetch(`/data/processed/${book.toLowerCase().replace(/\s+/g, '-')}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load verses for ${book}`);
      }
      
      const data = await response.json();
      this.cache.set(book, data.verses);
      return data.verses;
    } catch (error) {
      console.error(`Error loading verses for ${book}:`, error);
      return [];
    }
  }

  async getVerse(book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
    const verses = await this.getVerses(book);
    return verses.find(v => v.chapter === chapter && v.verse === verse) || null;
  }

  async searchVerses(query: string): Promise<BibleVerse[]> {
    const results: BibleVerse[] = [];
    const normalizedQuery = query.toLowerCase().trim();
    const searchTerms = normalizedQuery.split(/\s+/);
    
    // Check if the query matches a book chapter pattern (e.g., "peter 3")
    const chapterMatch = normalizedQuery.match(/^(\d?\s*\w+)\s+(\d+)$/i);
    if (chapterMatch) {
      const [, bookPart, chapterStr] = chapterMatch;
      const chapter = parseInt(chapterStr, 10);
      
      // Find matching books
      const matchingBooks = VALID_BOOKS.filter(book => 
        book.toLowerCase().includes(bookPart.trim().toLowerCase())
      );
      
      // Get verses from matching books and chapters
      for (const book of matchingBooks) {
        const verses = await this.getVerses(book);
        results.push(...verses.filter(v => v.chapter === chapter));
      }
      
      return results;
    }
    
    // Check if the query matches a book name
    const matchingBooks = VALID_BOOKS.filter(book => 
      book.toLowerCase().includes(normalizedQuery)
    );
    
    if (matchingBooks.length > 0) {
      // Return all verses from matching books
      for (const book of matchingBooks) {
        const verses = await this.getVerses(book);
        results.push(...verses);
      }
      return results;
    }
    
    // Regular text search if no specific patterns are found
    const bookPromises = VALID_BOOKS.map(book => this.getVerses(book));
    const allVerses = (await Promise.all(bookPromises)).flat();
    
    // Enhanced text search with multiple strategies
    return allVerses
      .map(verse => {
        const verseText = verse.text.toLowerCase();
        const score = this.calculateSearchScore(verseText, normalizedQuery, searchTerms);
        return { verse, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ verse }) => verse)
      .slice(0, 100); // Limit results to prevent overwhelming the UI
  }

  private calculateSearchScore(verseText: string, fullQuery: string, terms: string[]): number {
    let score = 0;
    
    // Exact match of the complete query (highest priority)
    if (verseText.includes(fullQuery)) {
      score += 100;
    }

    // Consecutive terms matching (high priority)
    let consecutiveMatches = 0;
    for (let i = 0; i < terms.length - 1; i++) {
      const term = terms[i];
      const nextTerm = terms[i + 1];
      if (verseText.includes(`${term} ${nextTerm}`)) {
        consecutiveMatches++;
      }
    }
    score += consecutiveMatches * 20;

    // Individual term matching (medium priority)
    const matchingTerms = terms.filter(term => verseText.includes(term));
    score += matchingTerms.length * 10;

    // Partial word matching (lower priority)
    const partialMatches = terms.filter(term => 
      term.length > 3 && // Only consider terms longer than 3 characters
      !matchingTerms.includes(term) && // Don't double count exact matches
      verseText.split(/\s+/).some(word => 
        word.includes(term) || term.includes(word)
      )
    );
    score += partialMatches.length * 5;

    return score;
  }
}

// List of valid Bible books in order
const VALID_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
  'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
  'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
  'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John',
  'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John',
  '2 John', '3 John', 'Jude', 'Revelation'
];

export const db = new LocalBibleDB();
export { VALID_BOOKS };
export type { BibleVerse };