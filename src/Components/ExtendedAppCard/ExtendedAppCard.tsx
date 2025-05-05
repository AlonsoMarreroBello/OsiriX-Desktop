import { Category } from "@mui/icons-material";
import AppInfo from "../../types/AppInfo";
import styles from "./ExtendedAppCard.module.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";

interface ExtendedAppCardProps {
  app: AppInfo;
  onHover?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, app: AppInfo) => void;
  onLeave?: () => void;
}

const ExtendedAppCard = ({ app, onHover, onLeave }: ExtendedAppCardProps) => {
  return (
    <div
      className={styles.container}
      onMouseEnter={(e) => onHover(e, app)}
      onMouseLeave={() => onLeave()}
    >
      <a href="https://guthib.com/" className={styles.mainLinkArea}>
        <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} />
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
      </a>
      <Button className={styles.addButton}>
        <AddCircleIcon className={styles.addIcon} fontSize="large" />
      </Button>
    </div>
  );
};

export default ExtendedAppCard;
