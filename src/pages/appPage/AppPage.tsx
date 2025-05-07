import React from "react";
import { useParams } from "react-router-dom"; // Para obtener el ID de la app de la URL si es necesario
import style from "./AppPage.module.css";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download"; // Icono de descarga
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper"; // Para los contenedores con bordes
import { fakeExampleAppFullData } from "../../data/FakeData";
// Datos de ejemplo (reemplazarías esto con datos reales o una carga desde API)

// Helper para obtener iniciales si no hay avatarUrl
const getFriendInitials = (name: string): string => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 0 || words[0] === "") return "?";
  return words[0][0].toUpperCase();
};

const AppPage: React.FC = () => {
  const appData = fakeExampleAppFullData;

  if (!appData) {
    return <Typography>Cargando datos de la aplicación...</Typography>; // O un componente de carga
  }

  const handleDownload = () => {
    if (appData.downloadLink) {
      console.log("Iniciando descarga desde:", appData.downloadLink);
      // window.location.href = appData.downloadLink; // O usar IPC para descargar en Electron
    } else {
      console.log("No hay enlace de descarga disponible.");
    }
  };

  return (
    <Box className={style.appPageContainer}>
      <Typography variant="h3" component="h1" className={style.appNameHeader}>
        {appData.name}
      </Typography>

      <Box className={style.mainGrid}>
        {/* Columna Izquierda: Imagen y Descripción */}
        <Box className={style.leftColumn}>
          <Paper elevation={3} className={style.imageOuterContainer}>
            <Box className={style.imageInnerContainer}>
              {/* El icono cuadrado azul es el fondo de este Box, la imagen va dentro */}
              <img src={appData.imageUrl} alt={`${appData.name} logo`} className={style.appImage} />
            </Box>
          </Paper>

          <Paper elevation={3} className={style.aboutSection}>
            <Typography variant="h5" component="h2" gutterBottom>
              Acerca de esta aplicación
            </Typography>
            <Typography variant="body1">{appData.description}</Typography>
          </Paper>
        </Box>

        {/* Columna Derecha: Detalles, Amigos y Descarga */}
        <Box className={style.rightColumn}>
          <Paper elevation={3} className={style.detailsSection}>
            <Typography variant="body2">
              <strong>Publicador:</strong> {appData.publisher}
            </Typography>
            <Typography variant="body2">
              <strong>Desarrollador:</strong> {appData.developer}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha Lanzamiento:</strong> {appData.releaseDate}
            </Typography>
            <Typography variant="body2">
              <strong>Descargas:</strong> {appData.downloads.toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Versión actual:</strong> {appData.currentVersion}
            </Typography>
          </Paper>

          <Paper elevation={3} className={style.friendsSection}>
            <Typography variant="h6" component="h3" gutterBottom>
              Amigos que tienen esta app
            </Typography>
            <AvatarGroup max={5} classes={{ avatar: style.customAvatar }}>
              {appData.friendsWhoHaveApp.map((friend) => (
                <Avatar
                  key={friend.id}
                  alt={friend.username}
                  src={friend.avatarUrl}
                  sx={{ bgcolor: friend.avatarUrl ? "transparent" : "primary.main" }} // Color de fondo si son iniciales
                >
                  {!friend.avatarUrl && (friend.initials || getFriendInitials(friend.username))}
                </Avatar>
              ))}
            </AvatarGroup>
          </Paper>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            className={style.downloadButton}
            disabled={!appData.downloadLink}
          >
            Descargar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AppPage;
