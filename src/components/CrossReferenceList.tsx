import React from 'react';
import { useCrossReferences } from '../hooks/useCrossReferences';
import { ArrowRight } from 'lucide-react';

interface CrossReferenceListProps {
  reference: string;
  onSelectVerse: (reference: string) => void;
}

export function CrossReferenceList({ reference, onSelectVerse }: CrossReferenceListProps) {
  const { crossRefs, loading } = useCrossReferences(reference);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading cross references...</div>;
  }

  if (crossRefs.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Cross References
      </h4>
      <div className="space-y-2">
        {crossRefs.map((ref) => (
          <button
            key={ref.target_reference}
            onClick={() => onSelectVerse(ref.target_reference)}
            className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400
                     hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowRight size={16} />
            <span>{ref.target_reference}</span>
          </button>
        ))}
      </div>
    </div>
  );
}