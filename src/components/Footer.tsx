import React from 'react';
import { Github, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          {/* About Section */}
          <div className="max-w-md mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              About Atom Verse
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A modern Bible verse search tool for the King James Version,
              built with React and TypeScript.
            </p>
          </div>

          {/* Links */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <a 
                href="https://github.com/yourusername/atom-verse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 
                         dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="w-full pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentYear} Atom Verse. All rights reserved.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> using React
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
