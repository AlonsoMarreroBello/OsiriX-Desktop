/* eslint-disable no-unused-vars */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: (callback: (maximized: boolean) => void) => {
    ipcRenderer.on("window:isMaximized", (_, maximized: boolean) => callback(maximized));
  },
  sendLoginSuccess: () => ipcRenderer.send("login-successful"),
  requestLogout: () => ipcRenderer.send("logout-requested"),
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
    };
  }
}
