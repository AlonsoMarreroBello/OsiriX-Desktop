import AppInfo from "../../types/AppInfo";
import styles from "./BasicAppCard.module.css";

interface BasicAppCardProp {
  app: AppInfo;
}

const BasicAppCard = ({ app }: BasicAppCardProp) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} loading="lazy" />
      </div>
      <div className={styles.title}>{app.name}</div>
    </div>
  );
};

export default BasicAppCard;
