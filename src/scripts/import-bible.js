import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');
const publicDir = path.join(__dirname, '..', '..', 'public');

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

function validateVerse(verse) {
  if (!verse.book || typeof verse.book !== 'string') {
    return 'Invalid or missing book name';
  }
  
  if (!VALID_BOOKS.includes(verse.book)) {
    return `Invalid book name: ${verse.book}`;
  }
  
  if (!Number.isInteger(verse.chapter) || verse.chapter < 1) {
    return 'Chapter must be a positive integer';
  }
  
  if (!Number.isInteger(verse.verse) || verse.verse < 1) {
    return 'Verse must be a positive integer';
  }
  
  if (!verse.text || typeof verse.text !== 'string' || verse.text.trim().length === 0) {
    return 'Invalid or empty verse text';
  }
  
  return null;
}

async function validateBibleData(verses) {
  const errors = [];
  const seenVerses = new Set();
  
  verses.forEach((verse, index) => {
    // Check for basic validity
    const error = validateVerse(verse);
    if (error) {
      errors.push({ verse, error: `${error} at index ${index}` });
      return;
    }
    
    // Check for duplicates
    const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
    if (seenVerses.has(verseKey)) {
      errors.push({ verse, error: `Duplicate verse at index ${index}: ${verseKey}` });
    }
    seenVerses.add(verseKey);
  });
  
  return errors;
}

async function processBible() {
  try {
    console.log('Starting Bible processing...');
    
    // Read the Bible data from our local file
    const bibleData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'kjv-bible.json'), 'utf8')
    );
    
    // Validate the data
    console.log('Validating Bible data...');
    const validationErrors = await validateBibleData(bibleData.verses);
    
    if (validationErrors.length > 0) {
      console.error('Validation errors found:');
      validationErrors.forEach(error => {
        console.error(`- ${error.error}`);
      });
      throw new Error('Bible data validation failed');
    }
    
    console.log('✓ Bible data validation passed');
    
    // Process verses in batches
    const batchSize = 100;
    const verses = bibleData.verses;
    const totalVerses = verses.length;
    
    // Create statistics for each book
    const bookStats = new Map();
    
    verses.forEach(verse => {
      if (!bookStats.has(verse.book)) {
        bookStats.set(verse.book, { chapters: new Set(), verses: 0 });
      }
      const stats = bookStats.get(verse.book);
      stats.chapters.add(verse.chapter);
      stats.verses++;
    });
    
    // Print statistics
    console.log('\nBible Statistics:');
    console.log(`Total Books: ${bookStats.size}`);
    console.log(`Total Verses: ${totalVerses}`);
    console.log('\nBreakdown by Book:');
    
    for (const [book, stats] of bookStats) {
      console.log(`${book}:`);
      console.log(`  Chapters: ${stats.chapters.size}`);
      console.log(`  Verses: ${stats.verses}`);
    }
    
    // Create processed output directory if it doesn't exist
    const outputDir = path.join(publicDir, 'data', 'processed');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save processed data by book
    for (const book of VALID_BOOKS) {
      const bookVerses = verses.filter(v => v.book === book);
      if (bookVerses.length > 0) {
        const outputPath = path.join(outputDir, `${book.toLowerCase().replace(/\s+/g, '-')}.json`);
        await fs.writeFile(outputPath, JSON.stringify({ verses: bookVerses }));
        console.log(`✓ Saved ${book} (${bookVerses.length} verses)`);
      }
    }
    
    console.log('\n✓ Bible processing completed successfully');
    
  } catch (error) {
    console.error('Error processing Bible:', error);
    process.exit(1);
  }
}

processBible();
