import { useLocation, useParams } from "react-router-dom";
import style from "./DeveloperPage.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import AppInfo from "../../interfaces/AppInfo";
import appService from "../../services/AppService";
import AppList from "../../components/AppList/AppList";
const DeveloperPage = () => {
  const { developerId } = useParams();
  const location = useLocation();
  const { developerName } = location.state || {};
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);

  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
  };
  const search = () => {
    setFilteredApps((prev) =>
      prev.filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getDeveloperApps = async () => {
    const fetchedApps = await appService.getAppsByDeveloperId(Number(developerId));
    const appsWithImgs = await Promise.all(
      fetchedApps.map(async (app: AppInfo) => {
        const appImgUrl = await appService.getImageByAppId(app.appId);
        return { ...app, imgUrl: appImgUrl };
      })
    );
    handleAppList(appsWithImgs);
  };

  const handleAppList = (apps: AppInfo[]) => {
    setFilteredApps(apps);
  };
  useEffect(() => {
    if (!searchTerm) {
      getDeveloperApps();
    }
  }, [searchTerm]);
  return (
    <div className={style.developerPageContainer}>
      <div className={style.header}>
        <h1 className={style.headerTitle}>{developerName}</h1>
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
        <div className={style.subHeader}>
          <h1 className={style.headerTitle}>Aplicaciones</h1>
        </div>
        <div className={style.subAppsContainer}>
          <AppList
            apps={filteredApps}
            viewMode="detalles"
            withListContainer={false}
            withOwnAppContainer={false}
            checkViewMode={() => style.appMosaicList}
          />
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
