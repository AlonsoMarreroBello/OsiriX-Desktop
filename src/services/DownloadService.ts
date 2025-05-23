// services/DownloadService.ts
import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import authService from "./AuthService";
import { DownloadFileDirectlyParams } from "../interfaces/Download"; // Ajusta la ruta

const downloadApp = async (
  appId: number,
  filename: string, // ej: "data.zip"
  appName: string
  // onProgress ya no se pasará aquí, se manejará en el contexto a través de window.electron.onDownloadProgress
) => {
  try {
    // 1. Obtener la URL pre-firmada (esto no cambia)
    const { data } = await axios.get(`${API_PORT}/app/${appId}/download/${filename}`, {
      // Asumo que `filename` aquí es el nombre que tu API espera para generar la URL
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    const presignedUrl = data.url;

    if (!presignedUrl) {
      throw new Error("No se pudo obtener la URL de descarga pre-firmada.");
    }

    // 2. Iniciar la descarga en el proceso principal
    //    `filename` aquí debe ser el nombre con el que se guardará el ZIP, ej: "MyAppInstaller.zip" o "data.zip"
    //    `appName` es el nombre de la app para la carpeta de extracción y el acceso directo
    const params: DownloadFileDirectlyParams = {
      appId,
      filename: `${appName.replace(/\s+/g, "_")}_${appId}.zip`, // Un nombre de archivo ZIP único
      appName,
      presignedUrl,
    };

    const result = await window.electron.startAppDownload(params);

    if (!result.success) {
      // El error ya debería haber sido comunicado vía 'download-progress'
      // pero podemos lanzar uno aquí para el catch local si es necesario.
      console.error("Falló la iniciación de la descarga en el main process:", result.error);
      throw new Error(result.error || "Error al iniciar la descarga en el proceso principal.");
    }
    // El progreso y la finalización se manejarán a través de los eventos IPC 'download-progress'
    // Ya no necesitas enviar el buffer.
    console.log("Solicitud de descarga enviada al proceso principal.");
  } catch (error) {
    console.error("Download failed in renderer:", error);
    // Considera enviar un evento de error al contexto aquí si es un error antes de llamar al main process
    // o si `startAppDownload` falla de forma que no envía un evento de error.
    throw error; // Propaga el error para que el contexto lo pueda manejar si es necesario
  }
};

// arrayBufferToBase64 ya no es necesario aquí

export const downloadService = {
  downloadApp,
};
