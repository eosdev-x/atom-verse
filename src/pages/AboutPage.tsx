import { Bookmark, Clock3, Command, Keyboard, Moon, Search, Smartphone } from 'lucide-react';
import { AnimatedPage } from '../components/AnimatedPage';

const features = [
  {
    title: 'Book of Hours',
    description: 'Read eight offices from Isabel Florence Hapgood’s public-domain 1922 Service Book.',
    icon: Clock3,
  },
  {
    title: 'Fuzzy Search',
    description: 'Find verses by keyword, phrase, or partial reference with Fuse.js-powered matching.',
    icon: Search,
  },
  {
    title: 'Command Palette',
    description: 'Press ⌘K to jump between books, bookmarks, and app commands.',
    icon: Command,
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Move through results, bookmark focused verses, and open passages from the keyboard.',
    icon: Keyboard,
  },
  {
    title: 'Bookmarks',
    description: 'Save verses locally in this browser so they are ready when you return.',
    icon: Bookmark,
  },
  {
    title: 'Dark Mode',
    description: 'Switch between light and dark reading environments from the header.',
    icon: Moon,
  },
  {
    title: 'Mobile-First',
    description: 'Use Rhema comfortably on small screens with bottom navigation and touch targets.',
    icon: Smartphone,
  },
];

export function AboutPage(): JSX.Element {
  return (
    <AnimatedPage>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          About Rhema
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Rhema is a fast local Bible search and Book of Hours app built with React,
            TypeScript, TanStack Router, TanStack Query, Zustand, and Fuse.js.
          </p>
          <p>
            The King James Version (KJV) is bundled and searches run locally in the browser. The
            Eastern Orthodox Bible (EOB) is planned, but its text is withheld because it is
            copyrighted and Rhema does not yet have permission to host it. Bookmarks stay on the
            device through localStorage.
          </p>
          <p>
            The Hours text comes solely from Isabel Florence Hapgood’s 1922
            public-domain <cite>Service Book of the Holy Orthodox-Catholic Apostolic Church</cite>.
            Hapgood did not include the Midnight Office, Little Vespers, or Small Compline, so
            Rhema does not supply or reconstruct them.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
}
