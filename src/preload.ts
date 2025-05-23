/* eslint-disable no-unused-vars */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import {
  DownloadFileDirectlyParams,
  DownloadAppResult,
  DownloadProgressData,
  UninstallAppParams,
  UninstallAppResult,
} from "./interfaces/Download";
contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: (callback: (maximized: boolean) => void) => {
    ipcRenderer.on("window:isMaximized", (_, maximized: boolean) => callback(maximized));
  },
  sendLoginSuccess: () => ipcRenderer.send("login-successful"),
  requestLogout: () => ipcRenderer.send("logout-requested"),
  openExternal: (url: string) => ipcRenderer.send("open-external", url),
  startAppDownload: (params: DownloadFileDirectlyParams): Promise<DownloadAppResult> =>
    ipcRenderer.invoke("start-app-download", params), // DownloadAppResult podría necesitar un ajuste

  // NUEVO: Escuchar eventos de progreso
  onDownloadProgress: (callback: (data: DownloadProgressData) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: DownloadProgressData) =>
      callback(data);
    ipcRenderer.on("download-progress", handler);
    // Devuelve una función para remover el listener, importante para evitar memory leaks
    return () => ipcRenderer.removeListener("download-progress", handler);
  },
  startAppUninstall: (params: UninstallAppParams): Promise<UninstallAppResult> =>
    ipcRenderer.invoke("start-app-uninstall", params),
});

declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: (callback: (maximized: boolean) => void) => void;
      sendLoginSuccess: () => void;
      requestLogout: () => void;
      openExternal: (url: string) => void;
      startAppDownload: (params: DownloadFileDirectlyParams) => Promise<DownloadAppResult>; // NUEVO
      onDownloadProgress: (callback: (data: DownloadProgressData) => void) => () => void;
      startAppUninstall: (params: UninstallAppParams) => Promise<UninstallAppResult>;
    };
  }
}
