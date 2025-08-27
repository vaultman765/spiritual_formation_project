import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/context/authContext";
import { JourneyProvider } from "@/context/journeyContext";
import { ModalProvider } from "@/context/modalContext";
import { HelmetProvider } from "react-helmet-async";
import { loadGA4 } from "@/components/seo/ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
loadGA4(GA_MEASUREMENT_ID);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <JourneyProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </JourneyProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
