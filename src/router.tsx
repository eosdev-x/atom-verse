import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from './components/AppLayout';
import { AboutPage } from './pages/AboutPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SearchPage,
});

const readerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/read/$book/$chapter',
  component: ReaderPage,
});

const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks',
  component: BookmarksPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  readerRoute,
  bookmarksRoute,
  aboutRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
