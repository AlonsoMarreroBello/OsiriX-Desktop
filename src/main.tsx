import { createRoot } from "react-dom/client";
import App from "./components/app";
import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";

const root = createRoot(document.body);
root.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
