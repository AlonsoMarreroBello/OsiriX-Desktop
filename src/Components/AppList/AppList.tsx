/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AppInfo from "../../interfaces/AppInfo";
import styles from "./AppList.module.css";
import BasicAppCard from "../BasicAppCard/BasicAppCard";
import ExtendedAppCard from "../ExtendedAppCard/ExtendedAppCard";
import DetailedAppCard from "../DetailedAppCard/DetailedAppCard";
import SearchBar from "../SearchBar/SearchBar";
import FilterBar, { ViewMode } from "../FilterBar/FilterBar";

interface AppListProps {
  apps: AppInfo[];
  handleMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, app: AppInfo) => void | null;
  handleMouseLeave?: () => void | null;
}

const AppList = ({ apps, handleMouseEnter, handleMouseLeave }: AppListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("lista");

  const checkViewMode = () => {
    if (viewMode === "mosaico") {
      return styles.appMosaicList;
    } else if (viewMode === "lista") {
      return styles.appOtherList;
    }
  };
  useEffect(() => {
    checkViewMode();
  }, [viewMode]);
  const renderApps = (app: AppInfo) => {
    switch (viewMode.toLowerCase()) {
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
      default:
        return <DetailedAppCard key={app.id} app={app} />;
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className={styles.appsContainer}>
      <div className={styles.searchBarContainer}>
        <SearchBar />
      </div>
      <div className={styles.filterControlsContainer}>
        <FilterBar handleViewMode={handleViewModeChange} />
        <div className={styles.listContainer}>
          <div className={checkViewMode()}>{apps.map((app) => renderApps(app))}</div>
        </div>
      </div>
    </div>
  );
};

export default AppList;
