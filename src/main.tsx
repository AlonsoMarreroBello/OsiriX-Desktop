import { createRoot } from "react-dom/client";
import App from "./components/app";
import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";
import { DownloadProvider } from "./context/DownloadContext";
import GlobalDownload from "./components/DownloadCard/GlobalDownload/GlobalDownload";

const root = createRoot(document.body);
root.render(
  <StrictMode>
    <HashRouter>
      <DownloadProvider>
        <App />
        <GlobalDownload />
      </DownloadProvider>
    </HashRouter>
  </StrictMode>
);
