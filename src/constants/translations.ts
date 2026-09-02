export const TRANSLATIONS = [
  { id: 'kjv', label: 'KJV', name: 'King James Version', available: true },
  { id: 'eob', label: 'EOB', name: 'Eastern Orthodox Bible', available: false },
] as const;

export type TranslationId = typeof TRANSLATIONS[number]['id'];

export function getTranslation(id: TranslationId): typeof TRANSLATIONS[number] {
  return TRANSLATIONS.find((translation) => translation.id === id) ?? TRANSLATIONS[0];
}
