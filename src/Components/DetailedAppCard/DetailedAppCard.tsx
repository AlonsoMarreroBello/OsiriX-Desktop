import { CalendarMonth, Category, Download } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import styles from "./DetailedAppCard.module.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface DetailedAppCardProps {
  app: AppInfo;
}

const DetailedAppCard = ({ app }: DetailedAppCardProps) => {
  const navigate = useNavigate();
  const pressed = () => {
    console.log("presionao");
  };
  return (
    <div className={styles.container}>
      <a onClick={() => navigate(`/app/${app.appId}`)} className={styles.mainLinkArea}>
        <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} loading="lazy" />
        <div className={styles.contentWrapper}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{app.name}</h1>
          </div>
          <p className={styles.description}>{app.description}</p>

          <div className={styles.dataWrapper}>
            <CalendarMonth className={styles.metaDataIcon} />
            <span className={styles.dataText}>{app.publicationDate.toLocaleString()}</span>
            <Download className={styles.metaDataIcon} />
            <span className={styles.dataText}>{app.downloads}</span>
            <Category className={styles.metaDataIcon} />
            {app.categories.length > 1 ? (
              <span className={styles.dataText}>
                {app.categories.map((c) => c.categoryName).join(", ")}
              </span>
            ) : (
              <span className={styles.dataText}>{app.categories[0].categoryName}</span>
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
