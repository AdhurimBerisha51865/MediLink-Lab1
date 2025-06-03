import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import AdminAppContextProvider from "./context/AdminAppContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <DoctorContextProvider>
        <AdminContextProvider>
          <AdminAppContextProvider>
            <App />
          </AdminAppContextProvider>
        </AdminContextProvider>
      </DoctorContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);