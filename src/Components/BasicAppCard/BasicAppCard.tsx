import AppInfo from "../../types/AppInfo";
import styles from "./BasicAppCard.module.css";

interface BasicAppCardProp {
  app: AppInfo;
  onHover?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, app: AppInfo) => void;
  onLeave?: () => void;
}

const BasicAppCard = ({ app, onHover, onLeave }: BasicAppCardProp) => {
  return (
    <a href="https://guthib.com/" className={styles.mainLinkArea}>
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
