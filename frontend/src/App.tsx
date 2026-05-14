import { AnimatePresence, motion } from 'motion/react';
import { StrictMode, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router';

import AppLayout from './layouts/AppLayout.tsx';
import Test from './pages/Test.tsx';

function AnimatedOutlet() {
  const location = useLocation();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.24,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        element: <AnimatedOutlet />,
        children: [
          {
            index: true,
            lazy: () => import('./pages/Homepage.tsx').then(m => ({ Component: m.default })),
          },
          {
            path: 'ideas',
            lazy: () => import('./pages/Ideas.tsx').then(m => ({ Component: m.default })),
          },
          {
            path: 'projects',
            lazy: () => import('./pages/Projects.tsx').then(m => ({ Component: m.default })),
          },
          {
            path: 'about',
            lazy: () => import('./pages/About.tsx').then(m => ({ Component: m.default })),
          },
          {
            path: 'posts',
            lazy: () => import('./pages/Posts.tsx').then(m => ({ Component: m.default })),
          },
          {
            path: 'posts/:slug',
            lazy: () => import('./pages/Post.tsx').then(m => ({ Component: m.default })),
          },
          {
            path: 'test-page',
            element: <Test />,
          },
          {
            path: '*',
            lazy: () => import('./pages/errors/NotFound.tsx').then(m => ({ Component: m.default })),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
