import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import AdminAppContextProvider from "./context/AdminAppContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import DiagnosisContextProvider from "./context/diagnosisContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <AdminContextProvider>
        <DoctorContextProvider>
          <DiagnosisContextProvider>
            <AdminAppContextProvider>
              <App />
            </AdminAppContextProvider>
          </DiagnosisContextProvider>
        </DoctorContextProvider>
      </AdminContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
