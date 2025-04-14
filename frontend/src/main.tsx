import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import NavbarLayout from "./layouts/NavbarLayout.tsx";
import Homepage from "./pages/Homepage.tsx";
import About from "./pages/About.tsx";

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
            path: "about",
            element: <About />,
          },
        ],
      },
    ],
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root!).render(<RouterProvider router={router} />);
