import { Category } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import styles from "./ExtendedAppCard.module.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ExtendedAppCardProps {
  app: AppInfo;
  onHover?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, app: AppInfo) => void;
  onLeave?: () => void;
  handleClick?: () => void;
}

const ExtendedAppCard = ({ app, onHover, onLeave, handleClick }: ExtendedAppCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.container}
      onMouseEnter={(e) => onHover(e, app)}
      onMouseLeave={() => onLeave()}
    >
      <a onClick={() => navigate(`/app/${app.appId}`)} className={styles.mainLinkArea}>
        <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} />
        <div className={styles.contentWrapper}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{app.name}</h1>
          </div>

          <p className={styles.description}>{app.description}</p>

          <div className={styles.dataWrapper}>
            <Category className={styles.metaDataIcon} />
            {app.categories.length > 1 ? (
              <span className={styles.dataText}>
                {app.categories.map((c) => c.categoryName).join(", ")}
              </span>
            ) : (
              <span className={styles.dataText}>{app.categories[0].categoryName}</span>
            )}
          </div>
        </div>
      </a>
      <Button onClick={handleClick} className={styles.addButton}>
        <AddCircleIcon className={styles.addIcon} fontSize="large" />
      </Button>
    </div>
  );
};

export default ExtendedAppCard;
