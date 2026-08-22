import { ExternalLink, Heart } from 'lucide-react';
import { KeyboardHints } from './KeyboardHints';

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900
                       hidden md:block">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-md mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              About Atom Verse
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A modern Bible verse search tool for the King James Version,
              built with React and TypeScript.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/eosdev-x/atom-verse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                GitHub
              </a>
            </div>
          </div>

          <div className="w-full pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-between w-full max-w-xs">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentYear} Atom Verse. All rights reserved.
                </p>
                <KeyboardHints />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by&nbsp;
                <a
                  href="https://eosdev.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  eosdev
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
