import { useEffect, useRef, useState } from "react";
import hoverCardStyle from "../../components/HoverAppCard/HoverAppCard.module.css";
import AppInfo from "../../interfaces/AppInfo";
import HoverAppCard from "../../components/HoverAppCard/HoverAppCard";
import dummyAppData from "../../data/FakeData";
import AppList from "../../components/AppList/AppList";

interface CardPosition {
  top: number;
  left: number;
}

const HomePage = () => {
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
    <div>
      <AppList
        apps={dummyAppData}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
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

export default HomePage;
