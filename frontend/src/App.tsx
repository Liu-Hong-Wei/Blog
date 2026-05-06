import { AnimatePresence, motion } from 'motion/react';
import { StrictMode, lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router';

import AppLayout from './layouts/AppLayout.tsx';
import Test from './pages/Test.tsx';

// 懒加载页面组件 - 使用 React.lazy 的标准方式
const Homepage = lazy(() => import('./pages/Homepage.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Posts = lazy(() => import('./pages/Posts.tsx'));
const Ideas = lazy(() => import('./pages/Ideas.tsx'));
const Projects = lazy(() => import('./pages/Projects.tsx'));
const Post = lazy(() => import('./pages/Post.tsx'));
const NotFound = lazy(() => import('./pages/errors/NotFound.tsx'));

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
            element: <Homepage />,
          },
          {
            path: 'ideas',
            element: <Ideas />,
          },
          {
            path: 'projects',
            element: <Projects />,
          },
          {
            path: 'about',
            element: <About />,
          },
          {
            path: 'posts',
            element: <Posts />,
          },
          {
            path: 'posts/:slug',
            element: <Post />,
          },
          {
            path: 'test-page',
            element: <Test />,
          },
          {
            path: '*',
            element: <NotFound />,
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
