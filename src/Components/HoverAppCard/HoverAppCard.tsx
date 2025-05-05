import { CalendarMonth, Category, Download } from "@mui/icons-material";
import AppInfo from "../../types/AppInfo";
import style from "./HoverAppCard.module.css";
interface HoverAppCardProps {
  app: AppInfo;
  className?: string;
  inlineStyle?: React.CSSProperties;
}

const HoverAppCard = ({ app, className, inlineStyle }: HoverAppCardProps) => {
  return (
    <div className={`${style.container} ${className || ""}`} style={inlineStyle}>
      <div className={style.contentWrapper}>
        <img src={app.imgUrl} alt={`${app.name} banner`} className={style.banner} />
        <h1 className={style.title}>{app.name}</h1>
        <p className={style.description}>{app.description || "Descripción no disponible."}</p>
        <div className={style.metaDataGrid}>
          {/* Categorías */}
          {app.categories && app.categories.length > 0 && (
            <div className={style.metaDataItem}>
              <Category className={style.metaDataIcon} />
              <span className={style.metaDataText}>{app.categories.join(", ")}</span>
            </div>
          )}
          {/* Contador de Descargas */}
          {app.downloads !== undefined && (
            <div className={style.metaDataItem}>
              <Download className={style.metaDataIcon} />
              <span className={style.metaDataText}>{app.downloads.toLocaleString()}</span>
            </div>
          )}
          {/* Fecha  */}
          {app.releaseDate && (
            <div className={style.metaDataItem}>
              <CalendarMonth className={style.metaDataIcon} />
              <span className={style.metaDataText}>{app.releaseDate.toString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoverAppCard;
