// interfaces/Download.ts

// Parámetros para la invocación inicial desde el renderer al main
export interface DownloadFileDirectlyParams {
  appId: number;
  filename: string; // nombre del archivo ZIP, ej: "data.zip"
  appName: string; // nombre de la app para la carpeta y acceso directo
  presignedUrl: string;
}

// Resultado de la invocación inicial
export interface DownloadAppResult {
  success: boolean;
  error?: string;
  message?: string; // Mensaje como "Descarga iniciada"
}

// Datos enviados desde el main al renderer para el progreso
export interface DownloadProgressData {
  appId: number;
  percent?: number; // Progreso de la descarga del ZIP
  status: "downloading" | "extracting" | "creating_shortcut" | "completed" | "error";
  message?: string; // Mensaje más descriptivo, ej: "Extrayendo archivos..."
  error?: string;
  success?: boolean; // True si todo el proceso (descarga, extracción, shortcut) fue exitoso
}

export interface UninstallAppParams {
  appId: number; // For potential use in finding specific files if needed, or logging
  appName: string; // Crucial for finding the extraction folder and shortcut
}

export interface UninstallAppResult {
  success: boolean;
  message?: string;
  error?: string;
}
