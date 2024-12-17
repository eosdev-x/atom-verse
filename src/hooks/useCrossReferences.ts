import { useState, useEffect } from 'react';
import { bibleService } from '../services/bibleService';
import { CrossReference } from '../types/bible';
import toast from 'react-hot-toast';

export function useCrossReferences(reference: string) {
  const [crossRefs, setCrossRefs] = useState<CrossReference[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCrossRefs = async () => {
      if (!reference) return;

      setLoading(true);
      try {
        const refs = await bibleService.getCrossReferences(reference);
        setCrossRefs(refs);
      } catch (error) {
        toast.error('Error fetching cross references');
      } finally {
        setLoading(false);
      }
    };

    fetchCrossRefs();
  }, [reference]);

  return { crossRefs, loading };
}