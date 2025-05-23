import path from "path";
import os from "os";
import ws from "windows-shortcuts"; // Asegúrate de tener instalado: npm install windows-shortcuts
import { PowerShell } from "node-powershell";

export const createShortcut = async (exePath: string, appName: string) => {
  await new Promise<void>((resolve, reject) => {
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

  // Después de que la promesa de creación se resuelva exitosamente:
  console.log("Acceso directo creado, intentando refrescar el escritorio...");
  try {
    const ps = new PowerShell({
      executableOptions: {
        "-ExecutionPolicy": "Bypass",
        "-NoProfile": true,
      },
    });

    // Comando de PowerShell para notificar al shell de un cambio.
    // SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_FLUSHNOWAIT, NULL, NULL)
    // Otra opción podría ser forzar una actualización de iconos.
    // Este es un método común:
    await ps.invoke(`
      $code = @'
      [System.Runtime.InteropServices.DllImport("Shell32.dll")]
      private static extern int SHChangeNotify(int eventId, int flags, IntPtr item1, IntPtr item2);
      public static void Refresh() {
          SHChangeNotify(0x8000000, 0x1000, IntPtr.Zero, IntPtr.Zero); // SHCNE_ASSOCCHANGED, SHCNF_FLUSHNOWAIT
      }
'@
      Add-Type -MemberDefinition $code -Name ShellUtil -Namespace Utils
      [Utils.ShellUtil]::Refresh()
    `);
    console.log("Comando de refresco de PowerShell ejecutado.");
    await ps.dispose();
  } catch (refreshError) {
    console.error("Error al intentar refrescar el escritorio con PowerShell:", refreshError);
    // No relanzar el error aquí, ya que el acceso directo SÍ se creó.
    // Esto es un "mejor esfuerzo".
  }
};
