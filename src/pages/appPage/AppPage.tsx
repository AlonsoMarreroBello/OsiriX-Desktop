import { useEffect, useState } from "react";
import style from "./AppPage.module.css"; // Asegúrate que la ruta es correcta
import { Avatar, AvatarGroup, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import { useNavigate, useParams } from "react-router-dom";
import appService from "../../services/AppService";

const AppPage = () => {
  const navigate = useNavigate();
  const appId = useParams().appId;

  const [appData, setAppData] = useState<AppInfo>(null);

  const getAppData = async () => {
    if (appId) {
      const fetchedApp = await appService.getAppById(Number(appId));
      const appImgUrl = await appService.getImageByAppId(fetchedApp.appId);
      setAppData({ ...fetchedApp, imgUrl: appImgUrl });
    }
  };

  useEffect(() => {
    getAppData();
  }, []);

  if (!appData) {
    return <Typography>Cargando datos de la aplicación...</Typography>;
  }

  const getInitials = (name: string): string => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/);
    if (words.length === 0 || words[0] === "") return "?";
    if (words.length > 1 && words[1] !== "") {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

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
          <p
            onClick={() =>
              navigate(`/publisher/${appData.publisher.id}`, {
                state: { publisherName: appData.publisher.publisherName },
              })
            }
            className={`${style.appInfoText} ${style.appInfoTextLink}`}
          >
            Publicador: {appData.publisher.publisherName}
          </p>
          <p
            onClick={() =>
              navigate(`/developer/${appData.developer.id}`, {
                state: { developerName: appData.developer.name },
              })
            }
            className={`${style.appInfoText} ${style.appInfoTextLink}`}
          >
            Desarrollador: {appData.developer.name}
          </p>
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
            {/* <Avatar
              sx={{
                bgcolor: "var(--color-bg-tertiary)",
                color: "var(--color-white)",
                width: 44,
                height: 44,
                fontSize: "1.3rem",
                border: `2px solid var(--color-accent-secondary-dark)`,
                padding: "0.4rem",
              }}
            >
              {getInitials(user.username)}
            </Avatar> */}
          </AvatarGroup>
        </div>
      </div>
      {appData.isDownloadable && (
        <button className={style.downloadButton}>
          Descargar
          <Download fontSize="medium" />
        </button>
      )}
    </div>
  );
};

export default AppPage;
