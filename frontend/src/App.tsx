import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode, lazy } from "react";

import ErrorBoundary from "./layouts/ErrorBoundary.tsx";
import NavbarLayout from "./layouts/NavbarLayout.tsx";

// 懒加载页面组件 - 使用 React.lazy 的标准方式
const Homepage = lazy(() => import("./pages/Homepage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Posts = lazy(() => import("./pages/Posts.tsx"));
const Ideas = lazy(() => import("./pages/Ideas.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const Post = lazy(() => import("./pages/Post.tsx"));
const NotFound = lazy(() => import("./pages/status/NotFound.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "Ideas",
        element: <Ideas />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "posts/:slug",
        element: <Post />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </StrictMode >
  );
}

export default App;
