import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TranslationId } from '../constants/translations';

interface TranslationStore {
  translationId: TranslationId;
  setTranslation: (translationId: TranslationId) => void;
}

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set) => ({
      translationId: 'kjv',
      setTranslation: (translationId) => set({ translationId }),
    }),
    {
      name: 'rhema-translation',
      version: 1,
    },
  ),
);
