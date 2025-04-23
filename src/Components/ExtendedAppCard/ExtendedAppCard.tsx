import { Category } from "@mui/icons-material";
import AppInfo from "../../types/AppInfo";
import styles from "./ExtendedAppCard.module.css";

interface ExtendedAppCardProps {
  app: AppInfo;
}

const ExtendedAppCard = ({ app }: ExtendedAppCardProps) => {
  return (
    <div className={styles.container}>
      <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} loading="lazy" />
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{app.name}</h1>
        </div>

        <p className={styles.description}>{app.description}</p>

        <div className={styles.dataWrapper}>
          <Category className={styles.metaDataIcon} fontSize="medium" />
          {app.categories.length > 1 ? (
            <span className={styles.dataText}>{app.categories.join(", ")}</span>
          ) : (
            <span className={styles.dataText}>{app.categories}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtendedAppCard;
