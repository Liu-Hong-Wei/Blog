import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import App from "./App.tsx";
import NavbarLayout from "./layouts/NavbarLayout.tsx";
import Homepage from "./pages/Homepage.tsx";
import About from "./pages/About.tsx";
import Posts from "./pages/Posts.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Ideas from "./pages/Ideas.tsx";
import Projects from "./pages/Projects.tsx";
import Post from "./pages/Post.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <StrictMode>
        <App />
      </StrictMode>
    ),
    children: [
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
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);
