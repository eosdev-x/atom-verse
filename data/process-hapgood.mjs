import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIRECTORY = join(SCRIPT_DIRECTORY, 'sources', 'hapgood');
const OUTPUT_DIRECTORY = join(SCRIPT_DIRECTORY, '..', 'public', 'data', 'hours');

const SOURCE = {
  work: 'Service Book of the Holy Orthodox-Catholic Apostolic Church',
  translator: 'Isabel Florence Hapgood',
  year: 1922,
  publisher: 'Association Press, New York',
  license: 'Public domain (US)',
};

const OFFICES = [
  {
    id: 'great-vespers',
    title: 'Great Vespers',
    description: 'The evening office from Hapgood’s order for the All-Night Vigil.',
  },
  {
    id: 'matins',
    title: 'Matins',
    description: 'The morning office, including its psalmody, litanies, and dismissal.',
  },
  {
    id: 'first-hour',
    title: 'The First Hour',
    description: 'Prayer traditionally appointed near the beginning of the day.',
  },
  {
    id: 'third-hour',
    title: 'The Third Hour',
    description: 'Prayer traditionally appointed for the third hour of the day.',
  },
  {
    id: 'sixth-hour',
    title: 'The Sixth Hour',
    description: 'Prayer traditionally appointed for the sixth hour of the day.',
  },
  {
    id: 'ninth-hour',
    title: 'The Ninth Hour',
    description: 'Prayer traditionally appointed for the ninth hour of the day.',
  },
  {
    id: 'typica',
    title: 'The Typical Psalms',
    description: 'The psalms, Beatitudes, and prayers of the Typica.',
  },
  {
    id: 'grand-compline',
    title: 'Grand Compline',
    description: 'Hapgood’s office of Grand Compline for appointed vigils and fasts.',
  },
];

const RUNNING_HEADER_PATTERN = /^(?:[0-9i' $rS]+\s+)?(?:THE ALL[^a-z]*NIGHT VIGIL SERVICE|GREAT VESPERS|MATINS|THE (?:FIRST|THIRD|SIXTH|NINTH) HOUR|THE TYPICAL PSALMS|THE OFFICE OF (?:GRAND|QRAND) COMPLINE)(?:\s+['$Ii0-9rS]+)?[.*]?$/;
const ROLE_PATTERN = /^(Priest|Deacon|Reader|Choir|People|First Choir|Second Choir|Superior|And We|We)(?:,\s*aloud\.|[.,:*])?\s+(.*)$/s;
const RUBRIC_PATTERN = /^(?:\(?When\b|And if\b|And when\b|Then\b|But if\b|But otherwise\b|While\b|During\b|From Easter\b|On Saturday\b|The Priest\b|The Deacon\b|The Holy\b|After\b|Before\b|At Eastertide\b|Generally\b|In the Great Fast\b|For those\b|Let us pray, also\b)/i;
const PSALM_HEADING_PATTERN = /^Psalms?\s+([ivxlcdmu]+)\.(?:,\s*([ivxlcdmu]+)\.)?$/i;

const ROMAN_CORRECTIONS = new Map([
  ['cm', 'ciii'],
  ['hi', 'iii'],
  ['lxxxvih', 'lxxxviii'],
  ['u', 'li'],
]);

await mkdir(OUTPUT_DIRECTORY, { recursive: true });

const index = {
  title: 'Book of Hours',
  description: 'Eight daily offices from Isabel Florence Hapgood’s 1922 public-domain Service Book.',
  source: SOURCE,
  offices: OFFICES,
};

await writeJson(join(OUTPUT_DIRECTORY, 'index.json'), index);

for (const office of OFFICES) {
  const rawText = await readFile(join(SOURCE_DIRECTORY, `${office.id}.txt`), 'utf8');
  const sections = parseOffice(rawText);
  await writeJson(join(OUTPUT_DIRECTORY, `${office.id}.json`), {
    id: office.id,
    title: office.title,
    description: office.description,
    source: SOURCE,
    sections,
  });
}

function parseOffice(rawText) {
  const paragraphs = toParagraphs(cleanLines(rawText));
  const sections = [];
  let pendingPsalmReferences = [];

  for (const paragraph of paragraphs) {
    const psalmReferences = parsePsalmHeading(paragraph);

    if (psalmReferences.length > 0) {
      pendingPsalmReferences = psalmReferences;
      continue;
    }

    if (isSourceFootnote(paragraph)) {
      continue;
    }

    const section = toSection(paragraph);

    if (pendingPsalmReferences.length > 0) {
      section.heading = pendingPsalmReferences.map((reference) => reference.raw).join(', ');
      section.psalm = pendingPsalmReferences[0];

      if (pendingPsalmReferences.length > 1) {
        section.psalms = pendingPsalmReferences;
      }

      pendingPsalmReferences = [];
    }

    sections.push(section);
  }

  return mergePageBreaks(sections);
}

function cleanLines(rawText) {
  const sourceLines = rawText
    .replaceAll('\r', '')
    .split('\n')
    .map((line) => applyHighConfidenceCorrections(line.trim()))
    .filter((line) => !isPageNoise(line));
  const cleanedLines = [];

  for (let lineIndex = 0; lineIndex < sourceLines.length; lineIndex += 1) {
    let line = sourceLines[lineIndex];

    while (line.endsWith('-') && startsWithLowercase(sourceLines[lineIndex + 1])) {
      line = `${line.slice(0, -1)}${sourceLines[lineIndex + 1].trim()}`;
      lineIndex += 1;
    }

    if (PSALM_HEADING_PATTERN.test(line)) {
      cleanedLines.push('', line, '');
      continue;
    }

    cleanedLines.push(line);
  }

  return cleanedLines;
}

function isPageNoise(line) {
  if (!line) {
    return false;
  }

  return RUNNING_HEADER_PATTERN.test(line)
    || /^\d+[.*]?$/.test(line)
    || /^(?:N|r|hi|i6|IS['.]|3 Cff|c 3|Q n|S 3|ft -»|\*-■ c)$/.test(line)
    || /^Digitized by\b/i.test(line);
}

function startsWithLowercase(line) {
  return typeof line === 'string' && /^[a-z]/.test(line.trim());
}

function applyHighConfidenceCorrections(line) {
  return line
    .replaceAll('Cfroir', 'Choir')
    .replaceAll('A f roward', 'A froward')
    .replaceAll('despitef ully', 'despitefully')
    .replaceAll('hpnourable', 'honourable')
    .replaceAll('ki thine', 'in thine')
    .replaceAll('pathsfcof', 'paths of')
    .replaceAll('showfed', 'showed')
    .replaceAll('THey', 'They')
    .replaceAll('whicJh', 'which')
    .replaceAll('th^ world', 'the world')
    .replaceAll('teach us s to', 'teach us to')
    .replace(/^Psalm cm\.$/i, 'Psalm ciii.')
    .replace(/^Psalm hi\.$/i, 'Psalm iii.')
    .replace(/^Psalm lxxxvih\.$/i, 'Psalm lxxxviii.')
    .replace(/^Psalm u\.$/i, 'Psalm li.');
}

function toParagraphs(lines) {
  const paragraphs = [];
  let paragraphLines = [];

  for (const line of lines) {
    if (!line) {
      if (paragraphLines.length > 0) {
        paragraphs.push(joinParagraph(paragraphLines));
        paragraphLines = [];
      }
      continue;
    }

    paragraphLines.push(line);
  }

  if (paragraphLines.length > 0) {
    paragraphs.push(joinParagraph(paragraphLines));
  }

  return paragraphs.filter(Boolean);
}

function joinParagraph(lines) {
  return lines.join(' ').replace(/\s+/g, ' ').trim();
}

function isSourceFootnote(paragraph) {
  return /^\*\s*(?:See\b|For\b|Grand Compline is said)/i.test(paragraph)
    || /^•\s*See Appendix/i.test(paragraph);
}

function parsePsalmHeading(paragraph) {
  const match = PSALM_HEADING_PATTERN.exec(paragraph);

  if (!match) {
    return [];
  }

  return [match[1], match[2]]
    .filter(Boolean)
    .map((roman) => {
      const correctedRoman = ROMAN_CORRECTIONS.get(roman.toLowerCase()) ?? roman.toLowerCase();
      return {
        raw: `Psalm ${correctedRoman}.`,
        number: romanToInteger(correctedRoman),
      };
    })
    .filter((reference) => reference.number > 0 && reference.number <= 150);
}

function romanToInteger(roman) {
  const values = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 };
  let result = 0;
  let previous = 0;

  for (const character of [...roman].reverse()) {
    const value = values[character];

    if (!value) {
      return 0;
    }

    result += value < previous ? -value : value;
    previous = value;
  }

  return result;
}

function toSection(paragraph) {
  const roleMatch = ROLE_PATTERN.exec(paragraph);

  if (roleMatch) {
    return {
      role: mapRole(roleMatch[1]),
      text: roleMatch[2].trim(),
    };
  }

  return {
    role: RUBRIC_PATTERN.test(paragraph) || isParenthetical(paragraph) ? 'rubric' : 'reader',
    text: paragraph,
  };
}

function mergePageBreaks(sections) {
  const mergedSections = [];

  for (const section of sections) {
    const previousSection = mergedSections.at(-1);
    const previousEndsMidSentence = previousSection
      && !/[.!?;:)}\]”’]$/.test(previousSection.text);

    if (previousEndsMidSentence
      && previousSection.role === section.role
      && !section.heading
      && !section.psalm) {
      previousSection.text = `${previousSection.text} ${section.text}`;
      continue;
    }

    mergedSections.push(section);
  }

  return mergedSections;
}

function mapRole(label) {
  if (label === 'Priest') return 'priest';
  if (label === 'Deacon') return 'deacon';
  if (label.includes('Choir')) return 'choir';
  if (label === 'Reader') return 'reader';
  return 'people';
}

function isParenthetical(paragraph) {
  return (paragraph.startsWith('(') || paragraph.startsWith('{'))
    && (paragraph.endsWith(')') || paragraph.endsWith('}'));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
