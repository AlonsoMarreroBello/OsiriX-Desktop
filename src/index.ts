/* eslint-disable @typescript-eslint/no-empty-function */
import axios from "axios";
import { app, BrowserWindow, ipcMain, session, shell } from "electron";
import fs from "fs";
import path from "path";
import { createShortcut } from "./utils/CreateShortcut";
import unzipper from "unzipper";
import {
  DownloadAppResult,
  DownloadFileDirectlyParams,
  DownloadProgressData,
  UninstallAppParams,
  UninstallAppResult,
} from "./interfaces/Download";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false, // Desactiva el marco estándar
    titleBarStyle: "hidden", // Para macOS
    resizable: false,
    maximizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true, // 🔐 ¡CAMBIO IMPORTANTE! Habilitar webSecurity
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const isDev = process.env.NODE_ENV === "development";

    const cspDirectives = [
      `default-src 'self'`,
      `script-src 'self' ${isDev ? "'unsafe-eval'" : ""}`,
      `style-src 'self' 'unsafe-inline'`,
      `connect-src 'self' http://localhost:8080 http://localhost:9000`,
      `connect-src 'self' http://localhost:9092`,
      `connect-src 'self' http://localhost:9000`,
      `img-src 'self' data: http://localhost:9000`,
      `font-src 'self' data:`,
    ];

    // Filtra directivas vacías y une
    const finalCsp = cspDirectives
      .map((d) => d.trim())
      .filter((d) => d && d.split(" ").length > 1) // Asegura que la directiva tenga al menos un valor además del tipo
      .join("; ");

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [finalCsp],
      },
    });
  });

  createWindow();
});

ipcMain.on("login-successful", () => {
  if (mainWindow) {
    mainWindow.setResizable(true);
    mainWindow.setMaximizable(true);

    mainWindow.setSize(1600, 900, true);
    mainWindow.center();
  }
});

ipcMain.on("logout-requested", () => {
  if (mainWindow) {
    mainWindow.unmaximize();
    mainWindow.setSize(800, 600, true);
    mainWindow.center();

    mainWindow.setMaximizable(false);
    mainWindow.setResizable(false);
  }
});

ipcMain.on("window:minimize", () => mainWindow?.minimize());
ipcMain.on("window:maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on("window:close", () => mainWindow?.close());

ipcMain.on("open-external", (_event, url: string) => {
  if (url && typeof url === "string") {
    shell.openExternal(url);
  }
});

ipcMain.handle(
  "start-app-download",
  async (event, params: DownloadFileDirectlyParams): Promise<DownloadAppResult> => {
    const { appId, filename, appName, presignedUrl } = params;
    const sender = event.sender; // O usa mainWindow.webContents si prefieres

    const sendProgress = (data: Partial<DownloadProgressData>) => {
      sender.send("download-progress", { appId, ...data });
    };

    try {
      const downloadDir = "C:\\OsirixLibrary"; // Considera usar app.getPath('userData') o algo más dinámico
      if (
        !(await fs.promises
          .access(downloadDir)
          .then(() => true)
          .catch(() => false))
      ) {
        await fs.promises.mkdir(downloadDir, { recursive: true });
      }

      const zipPath = path.join(downloadDir, filename); // ej: C:\OsirixLibrary\data.zip
      const extractPath = path.join(downloadDir, appName); // ej: C:\OsirixLibrary\MiApp

      // 1. Descargar el archivo ZIP
      sendProgress({ status: "downloading", message: `Descargando ${appName}...`, percent: 0 });

      const response = await axios({
        method: "get",
        url: presignedUrl,
        responseType: "stream",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            sendProgress({ status: "downloading", percent });
          }
        },
      });

      const writer = fs.createWriteStream(zipPath);
      response.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on("finish", () => {
          sendProgress({ status: "downloading", message: "Descarga completada.", percent: 100 });
          resolve();
        });
        writer.on("error", (err) => {
          sendProgress({ status: "error", error: `Error al escribir ZIP: ${err.message}` });
          reject(err);
        });
        response.data.on("error", (err: Error) => {
          // Manejar errores del stream de axios también
          sendProgress({ status: "error", error: `Error en stream de descarga: ${err.message}` });
          writer.close(); // Cierra el writer si hay error en el stream de origen
          fs.unlink(zipPath, () => {}); // Intenta eliminar el archivo parcial
          reject(err);
        });
      });

      // 2. Descomprimir
      sendProgress({ status: "extracting", message: `Extrayendo ${appName}...` });
      // Asegúrate que el directorio de extracción existe y está vacío si es necesario
      if (
        await fs.promises
          .access(extractPath)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.promises.rm(extractPath, { recursive: true, force: true }); // Borra si ya existe
      }
      await fs.promises.mkdir(extractPath, { recursive: true });

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(zipPath)
          .pipe(unzipper.Extract({ path: extractPath }))
          .on("close", () => {
            sendProgress({ status: "extracting", message: "Extracción completada." });
            resolve();
          })
          .on("error", (err) => {
            sendProgress({ status: "error", error: `Error al extraer ZIP: ${err.message}` });
            reject(err);
          });
      });

      await fs.promises.unlink(zipPath);

      // 3. Encontrar .exe
      sendProgress({ status: "creating_shortcut", message: `Buscando ejecutable...` });
      const exePath = findExeRecursive(extractPath); // Tu función findExeRecursive
      if (!exePath) {
        const errMsg = "No se encontró ningún archivo .exe en el ZIP.";
        sendProgress({ status: "error", error: errMsg });
        throw new Error(errMsg);
      }
      console.log(exePath);

      // 4. Crear acceso directo
      sendProgress({
        status: "creating_shortcut",
        message: `Creando acceso directo para ${appName}...`,
      });
      await createShortcut(exePath, appName); // Tu función createShortcut

      sendProgress({
        status: "completed",
        message: `${appName} instalado correctamente.`,
        success: true,
      });
      return { success: true, message: "Proceso completado exitosamente." };
    } catch (err) {
      console.error("Error durante el proceso de descarga/instalación:", err);
      sendProgress({ status: "error", error: err.message || "Error desconocido", success: false });
      return { success: false, error: err.message || "Error desconocido en el proceso principal." };
    }
  }
);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const findExeRecursive = (dir: string): string | null => {
  console.log(`[findExeRecursive] Buscando .exe en directorio: ${dir}`);
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        console.log(`[findExeRecursive] Entrando en subdirectorio: ${fullPath}`);
        const found = findExeRecursive(fullPath);
        if (found) {
          console.log(`[findExeRecursive] .exe encontrado en subdirectorio: ${found}`);
          return found;
        }
      } else if (file.isFile() && file.name.toLowerCase().endsWith(".exe")) {
        // Insensible a mayúsculas/minúsculas
        console.log(`[findExeRecursive] ¡Archivo .exe encontrado!: ${fullPath}`);
        return fullPath;
      } else if (file.isFile()) {
        // console.log(`[findExeRecursive] Archivo encontrado (no .exe): ${file.name}`); // Descomentar para debugging muy verboso
      }
    }
  } catch (e) {
    console.error(`[findExeRecursive] Error al leer directorio ${dir}: ${e.message}`);
    return null;
  }
  console.log(`[findExeRecursive] No se encontró .exe en el nivel actual de: ${dir}`);
  return null;
};

ipcMain.handle(
  "start-app-uninstall",
  async (event, params: UninstallAppParams): Promise<UninstallAppResult> => {
    const { appId, appName } = params;
    console.log(`Main process: Iniciando desinstalación de ${appName} (ID: ${appId})`);

    const downloadDir = "C:\\OsirixLibrary"; // Consistent with download
    const extractPath = path.join(downloadDir, appName); // Folder where app was extracted
    const zipFilename = `${appName.replace(/\s+/g, "_")}_${appId}.zip`; // Original ZIP filename
    const zipPath = path.join(downloadDir, zipFilename);

    const desktopPath = app.getPath("desktop");
    const shortcutName = `${appName}.lnk`; // Assuming .lnk for Windows shortcuts
    const shortcutPath = path.join(desktopPath, shortcutName);

    let operationsFailed = false;
    const errors: string[] = [];

    try {
      // 1. Delete the shortcut
      try {
        if (
          await fs.promises
            .access(shortcutPath)
            .then(() => true)
            .catch(() => false)
        ) {
          await fs.promises.unlink(shortcutPath);
          console.log(`Main process: Acceso directo ${shortcutPath} eliminado.`);
        } else {
          console.log(`Main process: No se encontró el acceso directo ${shortcutPath}, omitiendo.`);
        }
      } catch (err) {
        console.error(`Main process: Error al eliminar acceso directo ${shortcutPath}:`, err);
        errors.push(`Error al eliminar acceso directo: ${err.message}`);
        operationsFailed = true;
      }

      // 2. Delete the extracted application folder
      try {
        if (
          await fs.promises
            .access(extractPath)
            .then(() => true)
            .catch(() => false)
        ) {
          await fs.promises.rm(extractPath, { recursive: true, force: true });
          console.log(`Main process: Carpeta de aplicación ${extractPath} eliminada.`);
        } else {
          console.log(`Main process: No se encontró la carpeta ${extractPath}, omitiendo.`);
        }
      } catch (err) {
        console.error(`Main process: Error al eliminar la carpeta ${extractPath}:`, err);
        errors.push(`Error al eliminar carpeta de aplicación: ${err.message}`);
        operationsFailed = true;
      }

      // 3. (Optional) Delete the original ZIP file if it still exists
      try {
        if (
          await fs.promises
            .access(zipPath)
            .then(() => true)
            .catch(() => false)
        ) {
          await fs.promises.unlink(zipPath);
          console.log(`Main process: Archivo ZIP ${zipPath} eliminado.`);
        } else {
          console.log(`Main process: No se encontró el archivo ZIP ${zipPath}, omitiendo.`);
        }
      } catch (err) {
        console.error(`Main process: Error al eliminar archivo ZIP ${zipPath}:`, err);
        // This is less critical, so maybe don't set operationsFailed = true unless desired
        // errors.push(`Error al eliminar archivo ZIP: ${err.message}`);
      }

      if (operationsFailed) {
        const fullErrorMessage = `Errores durante la desinstalación de ${appName}: ${errors.join("; ")}`;
        console.error(fullErrorMessage);
        return { success: false, error: fullErrorMessage };
      }

      console.log(`Main process: Desinstalación de ${appName} completada.`);
      return { success: true, message: `${appName} desinstalado correctamente.` };
    } catch (err) {
      // Catch-all for unexpected errors during the process
      const errorMessage = `Error general durante la desinstalación de ${appName}: ${err.message || "Error desconocido"}`;
      console.error(errorMessage, err);
      return { success: false, error: errorMessage };
    }
  }
);
