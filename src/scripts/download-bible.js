import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

// KJV Bible source URL
const BIBLE_SOURCE_URL = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/t_kjv.json';

async function downloadFile(url) {
  console.log('Downloading Bible data from:', url);
  const response = await axios.get(url);
  return response.data;
}

async function processBibleData() {
  try {
    console.log('Starting Bible download...');
    const bibleData = await downloadFile(BIBLE_SOURCE_URL);
    
    // Process and format the data
    const verses = [];
    
    // The structure is an array of verses with book, chapter, verse, and text
    bibleData.forEach(verse => {
      if (verse.t?.trim()) {
        verses.push({
          book: verse.b,
          chapter: verse.c,
          verse: verse.v,
          text: verse.t.trim()
        });
      }
    });
    
    // Save processed data
    const outputPath = path.join(dataDir, 'bible.json');
    await fs.writeFile(outputPath, JSON.stringify({ verses }, null, 2));
    
    console.log(`✓ Bible data downloaded and processed`);
    console.log(`✓ Total verses: ${verses.length}`);
    console.log(`✓ Data saved to: ${outputPath}`);
    console.log('\nNext steps:');
    console.log('1. Run npm run import-bible to import the verses into your database');
    
  } catch (error) {
    console.error('Error processing Bible data:', error);
    process.exit(1);
  }
}

processBibleData();
