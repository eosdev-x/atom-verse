import { Link, useMatchRoute } from '@tanstack/react-router';
import { Search, BookOpen, Bookmark, Info } from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: typeof Search;
}

const navItems: NavItem[] = [
  { label: 'Search', to: '/', icon: Search },
  { label: 'Reader', to: '/read/genesis/1', icon: BookOpen },
  { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
  { label: 'About', to: '/about', icon: Info },
];

export function BottomNav(): JSX.Element {
  const matchRoute = useMatchRoute();

  const isActive = (item: NavItem): boolean => {
    if (item.to === '/') {
      return matchRoute({ to: '/', fuzzy: false }) !== false;
    }
    return matchRoute({ to: item.to, fuzzy: true }) !== false;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg
                 border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1
                         transition-colors duration-200 min-w-[44px] min-h-[44px]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         focus-visible:ring-inset
                         ${active
                           ? 'text-blue-600 dark:text-blue-400'
                           : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                         }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
