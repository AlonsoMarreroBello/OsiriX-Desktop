import { CalendarMonth, Category, Download } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import style from "./HoverAppCard.module.css";
import React from "react";
interface HoverAppCardProps {
  app: AppInfo;
  className?: string;
  inlineStyle?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
  isDisplaced?: boolean; // Añadido para manejar el desplazamiento
}

const HoverAppCard = ({ app, className, inlineStyle, ref }: HoverAppCardProps) => {
  return (
    <div ref={ref} className={`${style.container} ${className || ""}`} style={inlineStyle}>
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
