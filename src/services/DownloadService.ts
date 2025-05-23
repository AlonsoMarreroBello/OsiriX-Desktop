/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import authService from "./AuthService";

const downloadApp = async (
  appId: number,
  filename: string,
  onProgress?: (percent: number) => void
) => {
  try {
    const { data } = await axios.get(`${API_PORT}/app/${appId}/download/${filename}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    const presignedUrl = data.url;

    const response = await axios.get(presignedUrl, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    // Crear y descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed", error);
  }
};

export const downloadService = {
  downloadApp,
};
