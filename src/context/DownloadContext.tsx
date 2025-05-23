// context/DownloadContext.tsx
import React, { createContext, useContext, useState } from "react";
import { downloadService } from "../services/DownloadService";

interface DownloadContextType {
  isDownloading: boolean;
  progress: number;
  startDownload: (appId: number, filename: string, appName: string) => void;
  appName: string;
}

const DownloadContext = createContext<DownloadContextType | null>(null);

export const useDownload = () => useContext(DownloadContext);

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [appName, setAppName] = useState("");

  const startDownload = async (appId: number, filename: string, appName: string) => {
    setIsDownloading(true);
    setAppName(appName);

    await downloadService.downloadApp(appId, filename, (percent) => {
      setProgress(percent);
    });

    setTimeout(() => {
      setIsDownloading(false);
      setProgress(0);
      setAppName("");
    }, 1000);
  };

  return (
    <DownloadContext.Provider value={{ isDownloading, progress, startDownload, appName }}>
      {children}
    </DownloadContext.Provider>
  );
};
