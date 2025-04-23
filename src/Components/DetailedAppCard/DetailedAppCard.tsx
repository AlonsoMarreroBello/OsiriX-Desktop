import { CalendarMonth, Category, Download } from "@mui/icons-material";
import AppInfo from "../../types/AppInfo";
import styles from "./DetailedAppCard.module.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";

interface DetailedAppCardProps {
  app: AppInfo;
}

const DetailedAppCard = ({ app }: DetailedAppCardProps) => {
  const pressed = () => {
    console.log("presionao");
  };
  return (
    <div className={styles.container}>
      <a href="https://guthib.com/" className={styles.mainLinkArea}>
        <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} loading="lazy" />
        <div className={styles.contentWrapper}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{app.name}</h1>
          </div>
          <p className={styles.description}>{app.description}</p>

          <div className={styles.dataWrapper}>
            <CalendarMonth className={styles.metaDataIcon} fontSize="medium" />
            <span className={styles.dataText}>{app.releaseDate.toLocaleString()}</span>
            <Download className={styles.metaDataIcon} fontSize="medium" />
            <span className={styles.dataText}>{app.downloads}</span>
            <Category className={styles.metaDataIcon} fontSize="medium" />
            {app.categories.length > 1 ? (
              <span className={styles.dataText}>{app.categories.join(", ")}</span>
            ) : (
              <span className={styles.dataText}>{app.categories}</span>
            )}

            <span className={styles.versionText}>Version {app.version}</span>
          </div>
        </div>
      </a>
      <Button onClick={pressed} className={styles.addButton}>
        <AddCircleIcon className={styles.addIcon} fontSize="large" />
      </Button>
    </div>
  );
};

export default DetailedAppCard;
