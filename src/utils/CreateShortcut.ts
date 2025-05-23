import path from "path";
import os from "os";
import ws from "windows-shortcuts"; // Asegúrate de tener instalado: npm install windows-shortcuts

export const createShortcut = (exePath: string, appName: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const desktopPath = path.join(os.homedir(), "Desktop");
    // Asegúrate que el nombre del appName no contenga caracteres inválidos para nombres de archivo.
    // Podrías sanearlo si fuera necesario, aunque windows-shortcuts podría manejarlo.
    const shortcutName = `${appName}.lnk`;
    const shortcutPath = path.join(desktopPath, shortcutName);

    console.log(
      `Intentando crear acceso directo en: ${shortcutPath} para el ejecutable: ${exePath}`
    );

    ws.create(
      shortcutPath,
      {
        target: exePath,
        desc: `Acceso directo para ${appName}`,
        icon: exePath, // Utiliza el icono del ejecutable
        workingDir: path.dirname(exePath), // Establece el directorio de trabajo a la carpeta del .exe
        // runStyle: ws.NORMAL, // Puedes especificar ws.MINIMIZED o ws.MAXIMIZED si es necesario
      },
      (err: string | Error | null) => {
        if (err) {
          const errorToReject = typeof err === "string" ? new Error(err) : err;
          console.error(`Error al crear el acceso directo para '${appName}':`, errorToReject);
          reject(errorToReject);
        } else {
          console.log(`Acceso directo para '${appName}' creado exitosamente en ${shortcutPath}`);
          resolve();
        }
      }
    );
  });
};
