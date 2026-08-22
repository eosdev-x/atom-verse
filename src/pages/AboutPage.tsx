import { AnimatedPage } from '../components/AnimatedPage';

export function AboutPage(): JSX.Element {
  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          About Rhema
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Rhema is a fast local KJV Bible search app built with React,
            TypeScript, TanStack Router, TanStack Query, Zustand, and Fuse.js.
          </p>
          <p>
            Searches run against the bundled Bible JSON data in the browser, and
            bookmarks stay on the device through localStorage.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
