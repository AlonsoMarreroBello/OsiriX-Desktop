import AppInfo from "../interfaces/AppInfo";

type CategoryTab = "GAME" | "APP";

type ViewMode = "mosaico" | "lista" | "detalles";

// Modificamos sortOrderOptions
export interface SortOrderOption {
  value: string; // Un valor interno, ej: "asc", "desc", "shuffle"
  label: string; // Lo que se muestra al usuario, ej: "Ascendente"
}

const sortOrderOptions: SortOrderOption[] = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
  { value: "shuffle", label: "Aleatorio" }, // Cambié "sHufFle" a un valor más estándar y un label amigable
];
const sortCriteriaOptions = [
  "Fecha de lanzamiento", // Mapea a AppInfo.publicationDate
  "Descargas", // Mapea a AppInfo.downloads
  "Nombre de la app", // Mapea a AppInfo.name
];

export { CategoryTab, ViewMode, sortOrderOptions, sortCriteriaOptions };

export const commonFilterButtonSx = {
  background: "transparent",
  border: "none",
  color: "var(--color-text-accent-main)",
  padding: "0.6rem 1.1rem",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: "var(--border-radius-medium, 10px)", // Asegúrate que --border-radius-medium exista
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  transition: "background-color 0.3s ease-in-out, color 0.3s ease-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "var(--color-accent-pastel-main)",
    color: "var(--color-text-on-pastel)",
    boxShadow: "0 0 25px var(--color-accent-vibrant-green-shadow-hover)",
  },
};
export const commonFilterButtonActiveSx = {
  backgroundColor: "var(--color-accent-secondary-main)",
  color: "var(--color-text-on-pastel)",
  boxShadow: "0 0 25px var(--color-accent-vibrant-green-shadow-hover)",
};

export const menuPaperProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
    mt: 0.5,
    backgroundColor: "var(--color-bg-secondary)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border-primary)",
    borderRadius: "var(--border-radius-small)",
    "& .MuiMenuItem-root": {
      padding: "10px 16px",
      fontSize: "0.95rem",
      color: "var(--color-text-secondary)",
      "&:hover": {
        backgroundColor: "var(--color-bg-tertiary)",
        color: "var(--color-text-primary)",
      },
    },
  },
};

export const viewOptions = [
  { label: "Mosaico", value: "mosaico" },
  { label: "Lista", value: "lista" },
  { label: "Detalles", value: "detalles" },
];

export const sortCriteriaToAppInfoKey: Record<string, keyof AppInfo | undefined> = {
  "Fecha de lanzamiento": "publicationDate",
  Descargas: "downloads",
  "Nombre de la app": "name",
};

// Fisher-Yates shuffle algorithm (sin cambios)
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
