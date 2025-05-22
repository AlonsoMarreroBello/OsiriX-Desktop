// src/components/HoverAppCard/HoverAppCardMUI.tsx
import React from "react";
import { Popper, Paper, Box, Typography, Fade } from "@mui/material";
import { CalendarMonth, Category, Download } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import styles from "./HoverAppCardMui.module.css"; // Reutilizaremos algunos estilos

interface HoverAppCardMUIProps {
  app: AppInfo | null;
  anchorEl: HTMLElement | null;
  open: boolean;
  // Pasaremos una ref para que el componente padre pueda medirlo
  popperRef?: React.Ref<HTMLDivElement>;
  // Para aplicar el transform calculado por el padre
  transformStyle?: React.CSSProperties;
}

const HoverAppCardMUI: React.FC<HoverAppCardMUIProps> = ({
  app,
  anchorEl,
  open,
  popperRef,
  transformStyle,
}) => {
  if (!app) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="right-start" // Posición inicial, la lógica de ajuste la refinará
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [20, 20], // [skidding, distance] - similar a tu +20
          },
        },
      ]}
      transition
      style={{ zIndex: 1000, ...transformStyle }} // Aplicamos el zIndex y el transform
      // La ref se pasa al div interno del Popper para medición precisa
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={200}>
          {/* Usamos el popperRef en el Paper para las mediciones de desbordamiento */}
          <Paper
            ref={popperRef}
            elevation={5}
            sx={{
              width: "300px", // Ancho fijo o min/max según necesites
              maxWidth: "350px",
              padding: "16px",
              backgroundColor: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              borderRadius: "var(--border-radius-medium)",
              border: "1px solid var(--color-border-primary)",
              boxShadow: "0 4px 12px var(--shadow-default)",
              // Aplicamos la clase del módulo CSS si es necesario para estilos específicos
              // que no cubra sx o para mantener la estructura de HoverAppCard.module.css
              [`&.${styles.containerVisible}`]: {}, // Placeholder si usas la clase para algo
            }}
          >
            {/* Contenido interno (mantenemos tu estructura) */}
            <Box className={styles.contentWrapper}>
              <Box
                component="img"
                src={app.imgUrl}
                alt={`${app.name} banner`}
                className={styles.banner} // Asegúrate que HoverAppCard.module.css define .banner
                sx={{
                  width: "100%",
                  height: "150px", // Ajusta según necesidad
                  objectFit: "cover",
                  borderRadius: "var(--border-radius-small)",
                  marginBottom: "12px",
                }}
              />
              <Typography
                variant="h6"
                component="h1"
                className={styles.title} // De HoverAppCard.module.css
                sx={{
                  color: "var(--color-text-headings-light)",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                {app.name}
              </Typography>
              <Typography
                variant="body2"
                className={styles.description} // De HoverAppCard.module.css
                sx={{
                  color: "var(--color-text-secondary)",
                  marginBottom: "16px",
                  minHeight: "40px", // Para evitar saltos de altura
                }}
              >
                {app.description || "Descripción no disponible."}
              </Typography>

              {/* MetaDataGrid - Replicamos la estructura */}
              <Box className={styles.metaDataGrid}>
                {app.categories && app.categories.length > 0 && (
                  <Box
                    className={styles.metaDataItem}
                    sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                  >
                    <Category
                      className={styles.metaDataIcon}
                      sx={{ color: "var(--color-text-tertiary)", mr: 1, fontSize: "1.1rem" }}
                    />
                    <Typography
                      variant="caption"
                      className={styles.metaDataText}
                      sx={{ color: "var(--color-text-tertiary)" }}
                    >
                      {app.categories.map((c) => c.categoryName).join(", ")}
                    </Typography>
                  </Box>
                )}
                {app.downloads !== undefined && (
                  <Box
                    className={styles.metaDataItem}
                    sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                  >
                    <Download
                      className={styles.metaDataIcon}
                      sx={{ color: "var(--color-text-tertiary)", mr: 1, fontSize: "1.1rem" }}
                    />
                    <Typography
                      variant="caption"
                      className={styles.metaDataText}
                      sx={{ color: "var(--color-text-tertiary)" }}
                    >
                      {app.downloads.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                {app.publicationDate && (
                  <Box
                    className={styles.metaDataItem}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CalendarMonth
                      className={styles.metaDataIcon}
                      sx={{ color: "var(--color-text-tertiary)", mr: 1, fontSize: "1.1rem" }}
                    />
                    <Typography
                      variant="caption"
                      className={styles.metaDataText}
                      sx={{ color: "var(--color-text-tertiary)" }}
                    >
                      {new Date(app.publicationDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default HoverAppCardMUI;
