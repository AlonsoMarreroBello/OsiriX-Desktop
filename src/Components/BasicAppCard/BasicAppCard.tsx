import AppInfo from "../../types/AppInfo";
import HoverAppCard from "../HoverAppCard/HoverAppCard";
import styles from "./BasicAppCard.module.css";

interface BasicAppCardProp {
  app: AppInfo;
}

const BasicAppCard = ({ app }: BasicAppCardProp) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <img src={app.imgUrl} alt={`${app.name} icon`} className={styles.icon} loading="lazy" />
      </div>
      <div className={styles.titleContainer}>
        <p className={styles.title}>{app.name} </p>
      </div>
      <HoverAppCard app={app} className={styles.hoverCard} />
    </div>
  );
};

export default BasicAppCard;
