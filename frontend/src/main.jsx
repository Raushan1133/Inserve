import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "@descope/react-sdk";
import { Provider } from "react-redux";
import store from "./app/store";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider projectId="P2piC2F62Jz334D1MJSzyJze3LLv">
      <ThemeProvider>
        <Provider store={store}>
          <Toaster />
        <App />
        </Provider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
