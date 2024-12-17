import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

async function convertBible() {
  try {
    console.log('Reading KJV Bible data...');
    let rawData = await fs.readFile(path.join(dataDir, 'kjv-complete.json'), 'utf8');
    
    // Remove BOM if present
    if (rawData.charCodeAt(0) === 0xFEFF) {
      rawData = rawData.slice(1);
    }
    
    const bibleData = JSON.parse(rawData);
    
    const verses = [];
    
    // Convert the data to our format
    bibleData.forEach(book => {
      book.chapters.forEach((chapter, chapterIndex) => {
        chapter.forEach((verseText, verseIndex) => {
          verses.push({
            book: book.name,
            chapter: chapterIndex + 1,
            verse: verseIndex + 1,
            text: verseText
          });
        });
      });
    });
    
    console.log(`Converted ${verses.length} verses`);
    
    // Write the converted data
    const outputData = { verses };
    await fs.writeFile(
      path.join(dataDir, 'kjv-bible.json'),
      JSON.stringify(outputData, null, 2),
      'utf8'
    );
    
    console.log('✓ Bible data converted successfully');
    console.log(`Total verses: ${verses.length}`);
    
  } catch (error) {
    console.error('Error converting Bible data:', error);
    process.exit(1);
  }
}

convertBible();
