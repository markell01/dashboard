import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./components/MainLayout";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Instructions from "./pages/Instructions";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Projects />,
        },
        {
          path: "/instructions",
          element: <Instructions />,
        },
        {
          path: "/about",
          element: <About />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
