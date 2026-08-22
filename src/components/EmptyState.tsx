import { Search, BookmarkPlus, BookOpen } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

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
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <IconComponent className="w-6 h-6 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                     focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <Search className="w-4 h-4" />
          {action.label}
        </Link>
      )}
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {chips.map((chip) => (
            <motion.button
              key={chip.label}
              onClick={chip.onClick}
              className="px-3 py-1.5 rounded-full text-sm
                         bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1 }}
            >
              {chip.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
