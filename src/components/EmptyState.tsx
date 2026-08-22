import { Search, BookmarkPlus, BookOpen } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface EmptyStateProps {
  icon: 'search' | 'bookmark' | 'book';
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
  };
  chips?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const iconMap = {
  search: Search,
  bookmark: BookmarkPlus,
  book: BookOpen,
};

export function EmptyState({ icon, title, description, action, chips }: EmptyStateProps): JSX.Element {
  const IconComponent = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <IconComponent className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white
                     hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
        >
          {action.label}
        </Link>
      )}
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              className="px-3 py-1.5 rounded-full text-sm
                         bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
