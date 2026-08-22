import { Outlet, useLocation } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export function AppLayout(): JSX.Element {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-20 md:pt-8 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'text-sm',
          style: {
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
          },
        }}
      />
    </div>
  );
}
