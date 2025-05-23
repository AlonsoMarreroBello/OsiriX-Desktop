// components/GlobalDownload/GlobalDownload.tsx
import React from "react";
import { useDownload } from "../../../context/DownloadContext"; // Ajusta la ruta
import DownloadProgress from "../DownloadProgress"; // Crea este archivo CSS si necesitas estilos para el contenedor

const GlobalDownload = () => {
  const { downloads } = useDownload();

  if (!downloads || downloads.length === 0) {
    return null;
  }

  // Mostrar solo la primera descarga activa, o adaptar para mostrar una lista
  // Aquí un ejemplo simple mostrando todas las descargas activas (no completadas o con error persistente)
  const activeDownloads = downloads.filter((d) => d.status !== "completed" && d.status !== "error");

  if (activeDownloads.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {activeDownloads.map((download) => (
        <DownloadProgress
          key={download.appId}
          appName={download.appName}
          progress={download.progress}
        />
      ))}
    </div>
  );
};

export default GlobalDownload;
