import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Authentication, { PageType } from "./pages/Authentication.jsx";
import AddChallenge from "./pages/AddChallenge.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify"; // Importando ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importando o CSS do Toast
import './styles/styles.css';

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
  {
    path: "/login",
    element: <Authentication pageType={PageType.LOGIN} />,
  },
  {
    path: "/register",
    element: <Authentication pageType={PageType.REGISTER} />,
  },
  {
    path: "/add-challenge",
    element: <AddChallenge />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CookiesProvider>
  </StrictMode>
);
