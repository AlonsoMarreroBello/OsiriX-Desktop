import { useNavigate } from "react-router-dom";
import AppInfo from "../../interfaces/AppInfo";
import styles from "./BasicAppCard.module.css";

interface BasicAppCardProp {
  app: AppInfo;
  onHover?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, app: AppInfo) => void;
  onLeave?: () => void;
}

const BasicAppCard = ({ app, onHover, onLeave }: BasicAppCardProp) => {
  const navigate = useNavigate();
  return (
    <a onClick={() => navigate(`/app/${app.appId}`)} className={styles.mainLinkArea}>
      <div
        className={styles.container}
        onMouseEnter={(e) => onHover(e, app)}
        onMouseLeave={() => onLeave()}
      >
        <div className={styles.contentWrapper}>
          <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} loading="lazy" />
        </div>
        <div className={styles.titleContainer}>
          <p className={styles.title}>{app.name} </p>
        </div>
      </div>
    </a>
  );
};

export default BasicAppCard;
