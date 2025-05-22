import { CalendarMonth, Category, Download } from "@mui/icons-material";
import AppInfo from "../../interfaces/AppInfo";
import style from "./HoverAppCard.module.css";
import React, { useEffect, useState } from "react";
interface HoverAppCardProps {
  app: AppInfo;
  inlineStyle?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
  isDisplaced?: boolean; // Añadido para manejar el desplazamiento
}

const HoverAppCard = ({ app, inlineStyle, ref }: HoverAppCardProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);
  return (
    <div
      ref={ref}
      className={`${style.container} ${visible ? style.containerVisible : ""}`}
      style={inlineStyle}
    >
      <div className={style.contentWrapper}>
        <img src={app.imgUrl} alt={`${app.name} banner`} className={style.banner} />
        <h1 className={style.title}>{app.name}</h1>
        <p className={style.description}>{app.description || "Descripción no disponible."}</p>
        <div className={style.metaDataGrid}>
          {/* Categorías */}
          {app.categories && app.categories.length > 0 && (
            <div className={style.metaDataItem}>
              <Category className={style.metaDataIcon} />
              <span className={style.metaDataText}>
                {app.categories.map((c) => c.categoryName).join(", ")}
              </span>
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
          {app.publicationDate && (
            <div className={style.metaDataItem}>
              <CalendarMonth className={style.metaDataIcon} />
              <span className={style.metaDataText}>{app.publicationDate.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoverAppCard;
