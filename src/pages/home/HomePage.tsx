import { useEffect, useState } from "react";

import AppList from "../../components/AppList/AppList";
import FilterBar, { ViewMode } from "../../components/FilterBar/FilterBar";
import style from "./HomePage.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import AppInfo from "../../interfaces/AppInfo";
import appService from "../../services/AppService";

const HomePage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [apps, setApps] = useState<AppInfo[]>([]);
  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const search = () => {
    searchAppsByName();
  };
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleAppList = (apps: AppInfo[]) => {
    setApps(apps);
  };

  const searchAppsByName = async () => {
    const fetchedApps = await appService.getAppsByName(searchTerm);
    console.log(fetchedApps);
    setApps(fetchedApps);
  };
  const checkViewMode = () => {
    if (viewMode === "mosaico") {
      return style.appMosaicList;
    } else if (viewMode === "lista") {
      return style.appOtherList;
    }
  };

  useEffect(() => {
    checkViewMode();
  }, [viewMode]);

  useEffect(() => {
    console.log(apps);
    getAllApps();
  }, []);

  const getAllApps = async () => {
    const fetchedApps = await appService.getApps();
    console.log(fetchedApps);
    setApps(fetchedApps);
  };

  return (
    <div className={style.homePageContainer}>
      <div className={style.searchBarContainer}>
        <SearchBar
          placeholder="Buscar aplicaciones"
          onSearch={search}
          value={searchTerm}
          onChange={(e) => handleSearchTerm(e.currentTarget.value)}
        />
      </div>
      <div className={style.filterControlsContainer}>
        <FilterBar handleViewMode={handleViewModeChange} setApps={handleAppList} />
      </div>
      <div className={style.appListContainer}>
        <AppList apps={apps} checkViewMode={checkViewMode} viewMode={viewMode} />
      </div>
    </div>
  );
};
export default HomePage;
