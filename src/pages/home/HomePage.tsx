import { useEffect, useState } from "react";
import { dummyAppData } from "../../data/FakeData";
import AppList from "../../components/AppList/AppList";
import FilterBar, { ViewMode } from "../../components/FilterBar/FilterBar";
import style from "./HomePage.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";

const HomePage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("lista");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const search = () => {
    console.log("Buscando: ", searchTerm);
  };
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
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
        <FilterBar handleViewMode={handleViewModeChange} />
      </div>
      <div className={style.appListContainer}>
        <AppList apps={dummyAppData} checkViewMode={checkViewMode} viewMode={viewMode} />
      </div>
    </div>
  );
};

export default HomePage;
