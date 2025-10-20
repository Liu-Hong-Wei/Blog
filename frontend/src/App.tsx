import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode, lazy } from "react";

import SuspenseErrorBoundary from "./components/SuspenseErrorBoundary.tsx";
import NavbarLayout from "./layouts/NavbarLayout.tsx";
import Test from "./tests/Test.tsx";

// 懒加载页面组件 - 使用 React.lazy 的标准方式
const Homepage = lazy(() => import("./pages/Homepage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Posts = lazy(() => import("./pages/Posts.tsx"));
const Ideas = lazy(() => import("./pages/Ideas.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const Post = lazy(() => import("./pages/Post.tsx"));
const NotFound = lazy(() => import("./pages/errors/NotFound.tsx"));

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
        path: "test",
        element: <Test />,

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
        <SuspenseErrorBoundary>
          <RouterProvider router={router} />
        </SuspenseErrorBoundary>
    </StrictMode >
  );
}

export default App;
