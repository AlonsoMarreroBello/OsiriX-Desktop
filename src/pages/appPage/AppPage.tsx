import React, { useEffect, useState } from "react";
import style from "./AppPage.module.css"; // Asegúrate que la ruta es correcta
import { Avatar, AvatarGroup, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import { useParams } from "react-router-dom";
import appService from "../../services/AppService";

const AppPage: React.FC = () => {
  const appId = useParams().appId;

  const [appData, setAppData] = useState<AppInfo>(null);

  const getAppData = async () => {
    if (appId) {
      const fetchedApp = await appService.getAppById(Number(appId));
      setAppData(fetchedApp);
    }
  };

  useEffect(() => {
    getAppData();
  }, []);

  if (!appData) {
    return <Typography>Cargando datos de la aplicación...</Typography>;
  }

  // const handleDownload = () => {
  //   if (appData.downloadLink) {
  //     console.log("Iniciando descarga desde:", appData.downloadLink);
  //   } else {
  //     console.log("No hay enlace de descarga disponible.");
  //   }
  // };

  // const getFriendInitials = (name: string): string => {
  //   if (!name) return "?";
  //   const words = name.trim().split(/\s+/);
  //   if (words.length === 0 || words[0] === "") return "?";
  //   return words[0][0].toUpperCase();
  // };

  return (
    <div className={style.appPageContainer}>
      <h1 className={style.appTitle}>{appData.name}</h1>
      <div className={style.topRow}>
        <div className={style.imageContainer}>
          <img src={appData.imgUrl} alt={`${appData.name} logo`} className={style.appImage} />
        </div>
        <div className={style.appInfoContainer}>
          <p className={style.appInfoText}>Publicador: {appData.publisher.publisherName}</p>
          <p className={style.appInfoText}>Desarrollador: {appData.developer.name}</p>
          <p className={style.appInfoText}>
            Fecha de lanzamiento: {appData.publicationDate.toLocaleString()}
          </p>
          <p className={style.appInfoText}>Descargas: {appData.downloads.toLocaleString()}</p>
          <p className={style.appInfoText}>Versión actual: {appData.version}</p>
        </div>
      </div>
      <div className={style.bottomRow}>
        <div className={style.aboutSection}>
          <h1 className={style.sectionTitle}>Acerca de esta aplicación</h1>
          <p className={style.aboutDescription}>{appData.description}</p>
        </div>
        <div className={style.friendsContainer}>
          <div className={style.friendsSection}>
            <h3 className={style.sectionTitle}>Amigos que tienen esta app</h3>
          </div>
          <AvatarGroup
            max={5}
            sx={{
              justifyContent: "flex-start",
              "& .MuiAvatar-root": {
                width: 52,
                height: 52,
                fontSize: "1rem",
                bgcolor: "var(--bg-secondary)",
                border: `2px solid var(--text-primary)`,
              },
            }}
          >
            {/* {appData.friendsWhoHaveApp.map((friend) => (
              <Avatar
                key={friend.id}
                alt={friend.username}
                src={friend.avatarUrl}
                className={style.friendAvatar}
              >
                {getFriendInitials(friend.username)}
              </Avatar>
            ))} */}
          </AvatarGroup>
        </div>
      </div>
      <button className={style.downloadButton}>
        Descargar
        <Download className={style.downloadIcon} fontSize="medium" />
      </button>
    </div>
  );
};

export default AppPage;
