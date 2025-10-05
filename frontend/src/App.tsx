import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";

import ErrorBoundary from "./layouts/ErrorBoundary.tsx";
import NavbarLayout from "./layouts/NavbarLayout.tsx";
import Homepage from "./pages/Homepage.tsx";
import About from "./pages/About.tsx";
import Posts from "./pages/Posts.tsx";
import Ideas from "./pages/Ideas.tsx";
import Projects from "./pages/Projects.tsx";
import Post from "./pages/Post.tsx";

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
    ],
  },
],
);

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
