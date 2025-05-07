/* eslint-disable no-unused-vars */
import { ReactNode, useEffect, useRef, useState } from "react";
import AppInfo from "../../interfaces/AppInfo";
import styles from "./AppList.module.css";
import BasicAppCard from "../BasicAppCard/BasicAppCard";
import ExtendedAppCard from "../ExtendedAppCard/ExtendedAppCard";
import DetailedAppCard from "../DetailedAppCard/DetailedAppCard";
import SearchBar from "../SearchBar/SearchBar";
import FilterBar, { ViewMode } from "../FilterBar/FilterBar";
import HoverAppCard from "../HoverAppCard/HoverAppCard";
import hoverCardStyle from "../HoverAppCard/HoverAppCard.module.css";

interface AppListProps {
  apps: AppInfo[];
  checkViewMode?: () => string;
  viewMode?: ViewMode;
}
interface CardPosition {
  top: number;
  left: number;
}
const AppList = ({ apps, checkViewMode, viewMode }: AppListProps) => {
  const [hoveredApp, setHoveredApp] = useState<AppInfo | null>(null);
  const [initialCardPosition, setInitialCardPosition] = useState<CardPosition | null>(null);
  const [adjustedCardPosition, setAdjustedCardPosition] = useState<CardPosition | null>(null);
  const hoverCardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, app: AppInfo) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const top = rect.top + window.scrollY - 20;
    const left = rect.right + window.scrollX + 20;

    setHoveredApp(app);
    setInitialCardPosition({ top, left });
    setAdjustedCardPosition({ top, left });
  };
  const handleMouseLeave = () => {
    setHoveredApp(null);
    setInitialCardPosition(null);
    setAdjustedCardPosition(null);
  };
  const renderApps = (app: AppInfo) => {
    switch (viewMode) {
      case "mosaico":
        return (
          <BasicAppCard
            key={app.id}
            app={app}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
          />
        );
      case "lista":
        return (
          <ExtendedAppCard
            key={app.id}
            app={app}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
          />
        );
      case "detalles":
        return <DetailedAppCard key={app.id} app={app} />;
      default:
        return (
          <BasicAppCard
            key={app.id}
            app={app}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
          />
        );
    }
  };

  useEffect(() => {
    if (hoveredApp && initialCardPosition && hoverCardRef.current) {
      const cardElement = hoverCardRef.current;
      const cardHeight = cardElement.offsetHeight;
      const viewportHeight = window.innerHeight;

      let newTop = initialCardPosition.top;
      const newLeft = initialCardPosition.left;

      const margin = 20;

      // Posición actual del tope de la pagina y el bottom acorde a la posicion de la tajertita
      const currentCardTopPage = initialCardPosition.top;
      const currentCardBottomPage = currentCardTopPage + cardHeight;

      // Límite inferior visible del viewport y el límite superior visible del viewport de la página
      const viewportBottomPage = window.scrollY + viewportHeight - margin;
      const viewportTopPage = window.scrollY + margin;

      if (currentCardBottomPage > viewportBottomPage) {
        newTop = viewportBottomPage - cardHeight;
      }
      if (newTop < viewportTopPage) {
        newTop = viewportTopPage;
      }

      // Evitar re renderizados en caso de que no haya cambios en la posicion..
      if (newTop !== adjustedCardPosition?.top || newLeft !== adjustedCardPosition?.left) {
        setAdjustedCardPosition({ top: newTop, left: newLeft });
      }
    }
  }, [hoveredApp, initialCardPosition]);

  return (
    <div className={styles.appsContainer}>
      <div className={styles.listContainer}>
        <div className={`${checkViewMode()} ${styles.appList}`}>
          {apps.map((app) => renderApps(app))}
        </div>
      </div>
      {hoveredApp && adjustedCardPosition && (
        <HoverAppCard
          app={hoveredApp}
          className={hoverCardStyle.containerVisible}
          inlineStyle={{
            position: "absolute",
            top: `${adjustedCardPosition.top}px`,
            left: `${adjustedCardPosition.left}px`,
            zIndex: 1000,
          }}
          ref={hoverCardRef}
        />
      )}
    </div>
  );
};

export default AppList;
