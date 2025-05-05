import { useState } from "react";
import hoverCardStyle from "src/components/HoverAppCard/HoverAppCard.module.css";
import style from "src/components/app.module.css";
import AppInfo from "../../interfaces/AppInfo";
import BasicAppCard from "../../components/BasicAppCard/BasicAppCard";
import ExtendedAppCard from "../../components/ExtendedAppCard/ExtendedAppCard";
import DetailedAppCard from "../../components/DetailedAppCard/DetailedAppCard";
import HoverAppCard from "../../components/HoverAppCard/HoverAppCard";
import dummyAppData from "../../data/FakeData";
import AppList from "../../components/AppList/AppList";

const HomePage = () => {


  const [hoveredApp, setHoveredApp] = useState<AppInfo | null>(null);
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number }>(null);



  const handleMouseEnter = (e: any, app: AppInfo | null) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const top = rect.top + scrollY - 20;
    const left = rect.right + scrollX + 20;
    setHoveredApp(app);
    setCardPosition({ top, left });
  };

  const handleMouseLeave = () => {
    setHoveredApp(null);
    setCardPosition(null);
  };


  return (
    <div>
      <AppList apps={dummyAppData} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
      {hoveredApp && cardPosition && (
        <HoverAppCard
          app={hoveredApp}
          className={hoverCardStyle.containerVisible}
          inlineStyle={{
            position: "absolute", // <--- POSICIÓN ABSOLUTA
            top: `${cardPosition.top}px`, // <--- TOP CALCULADO
            left: `${cardPosition.left}px`, // <--- LEFT CALCULADO
            zIndex: 1000, // <--- Z-INDEX ALTO
          }}
        />
      )}
    </div>
  )
}

export default HomePage