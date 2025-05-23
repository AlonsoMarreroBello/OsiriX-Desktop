// context/DownloadContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { downloadService } from "../services/DownloadService";
import { DownloadProgressData } from "../interfaces/Download"; // Ajusta la ruta

interface DownloadItem {
  appId: number;
  appName: string;
  progress: number;
  status: DownloadProgressData["status"];
  message?: string;
}

interface DownloadContextType {
  downloads: DownloadItem[]; // Podrías manejar múltiples descargas
  startDownload: (appId: number, filenameForApi: string, appName: string) => void; // filenameForApi es el que espera tu endpoint /download/:filename
}

const DownloadContext = createContext<DownloadContextType | null>(null);

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error("useDownload must be used within a DownloadProvider");
  }
  return context;
};

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const updateDownloadState = useCallback(
    (appId: number, appNameIfNew: string, data: Partial<DownloadProgressData>) => {
      setDownloads((prev) => {
        const existingIndex = prev.findIndex((d) => d.appId === appId);
        if (existingIndex > -1) {
          const updatedDownloads = [...prev];
          const currentDownload = updatedDownloads[existingIndex];
          updatedDownloads[existingIndex] = {
            ...currentDownload,
            progress: data.percent !== undefined ? data.percent : currentDownload.progress,
            status: data.status || currentDownload.status,
            message: data.message || currentDownload.message,
          };
          // Si se completó o hubo error, considera removerlo después de un tiempo o bajo alguna condición
          if (data.status === "completed" || data.status === "error") {
            // Podrías marcarlo para remoción o removerlo tras un delay
            console.log(`Download ${data.status}:`, data);
          }
          return updatedDownloads;
        } else if (data.status) {
          // Solo añadir si es un estado inicial válido
          return [
            ...prev,
            {
              appId,
              appName: appNameIfNew,
              progress: data.percent || 0,
              status: data.status,
              message: data.message,
            },
          ];
        }
        return prev;
      });
    },
    []
  );

  useEffect(() => {
    const removeListener = window.electron.onDownloadProgress((data: DownloadProgressData) => {
      console.log("Download progress event from main:", data);
      // Necesitas el appName aquí. Si el evento no lo trae,
      // tendrás que buscarlo en tu estado `downloads` o asumir que solo hay uno.
      // Para múltiples descargas, el `data.appId` es crucial.
      const currentDownload = downloads.find((d) => d.appId === data.appId);
      updateDownloadState(data.appId, currentDownload?.appName || "App Desconocida", data);

      if (data.status === "completed" && data.success) {
        // Opcional: limpiar después de un tiempo
        setTimeout(() => {
          setDownloads((prev) => prev.filter((d) => d.appId !== data.appId));
        }, 5000); // Limpia después de 5 segundos
      } else if (data.status === "error") {
        // Opcional: limpiar después de un tiempo
        setTimeout(() => {
          setDownloads((prev) => prev.filter((d) => d.appId !== data.appId));
        }, 10000); // Limpia después de 10 segundos
      }
    });

    return () => {
      removeListener(); // Limpiar el listener al desmontar el provider
    };
  }, [updateDownloadState, downloads]); // Asegúrate de incluir 'downloads' si lo usas dentro del callback de onDownloadProgress para encontrar appName

  const startDownload = async (appId: number, filenameForApi: string, appName: string) => {
    // Marcar que la descarga ha comenzado para esta app
    // filenameForApi es el que tu backend espera para generar la presigned URL
    // appName es para mostrar y para nombrar carpetas/accesos directos
    setDownloads((prev) => {
      if (
        prev.some(
          (d) => d.appId === appId && (d.status === "downloading" || d.status === "extracting")
        )
      ) {
        console.warn(`Download for ${appName} already in progress.`);
        return prev; // Evitar iniciar múltiples veces
      }
      const otherDownloads = prev.filter((d) => d.appId !== appId);
      return [
        ...otherDownloads,
        { appId, appName, progress: 0, status: "downloading", message: "Iniciando..." },
      ];
    });

    try {
      await downloadService.downloadApp(appId, filenameForApi, appName);
      // La actualización del progreso y estado final vendrá por IPC
    } catch (error) {
      console.error(`Error starting download for ${appName}:`, error);
      updateDownloadState(appId, appName, {
        status: "error",
        message: error.message || "Fallo al iniciar descarga.",
        success: false,
      });
    }
  };

  return (
    <DownloadContext.Provider value={{ downloads, startDownload }}>
      {children}
    </DownloadContext.Provider>
  );
};
