import SearchBar from "../../components/SearchBar/SearchBar";
import style from "./LibraryPage.module.css";
import { myDummyAppData as myApps } from "../../data/FakeData";
import AppInfo from "../../interfaces/AppInfo";
import { useEffect, useState } from "react";
import AppList from "../..//components/AppList/AppList";

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);

  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const search = () => {
    const searchedApps = myApps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApps(searchedApps);
  };

  const getAllUserApps = (myApps: AppInfo[]) => {
    const allApps = myApps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApps(allApps);
  };

  useEffect(() => {
    if (!searchTerm) {
      getAllUserApps(myApps);
    }
  }, [searchTerm]);

  return (
    <div className={style.libraryContainer}>
      <div className={style.header}>
        <h1 className={style.headerTitle}>Mis aplicaciones</h1>
        <div className={style.searchBarContainer}>
          <SearchBar
            onSearch={search}
            value={searchTerm}
            onChange={(e) => handleSearchTerm(e.currentTarget.value)}
            placeholder="Buscar aplicaciones"
          />
        </div>
      </div>
      <div className={style.appListContainer}>
        <AppList apps={filteredApps} checkViewMode={() => style.appMosaicList} />
      </div>
    </div>
  );
};

export default LibraryPage;
