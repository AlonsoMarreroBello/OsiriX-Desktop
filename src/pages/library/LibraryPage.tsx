import SearchBar from "../../components/SearchBar/SearchBar";
import style from "./LibraryPage.module.css";
import AppInfo from "../../interfaces/AppInfo";
import { useEffect, useState } from "react";
import AppList from "../..//components/AppList/AppList";
import appService from "../../services/AppService";
import authService from "../../services/AuthService";

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);
  const userId = authService.getUserId();
  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const search = () => {
    setFilteredApps((prev) =>
      prev.filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  const handleAppList = (apps: AppInfo[]) => {
    setFilteredApps(apps);
  };
  const getAllUserApps = async () => {
    const fetchedApps = await appService.getAppsByUserId(userId);
    const appsWithImgs = await Promise.all(
      fetchedApps.map(async (app: AppInfo) => {
        const appImgUrl = await appService.getImageByAppId(app.appId, "icono");
        return { ...app, imgUrl: appImgUrl };
      })
    );
    handleAppList(appsWithImgs);
  };

  useEffect(() => {
    if (!searchTerm) {
      getAllUserApps();
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
        <AppList apps={filteredApps} viewMode="mosaico" checkViewMode={() => style.appMosaicList} />
      </div>
    </div>
  );
};

export default LibraryPage;
