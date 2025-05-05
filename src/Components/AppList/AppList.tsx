import { useEffect, useState } from "react";
import AppInfo from "../../interfaces/AppInfo";
import dummyAppData from "../../data/FakeData";
import styles from './AppList.module.css';
import appStyle from "../app.module.css";
import { app } from "electron";
import BasicAppCard from "../BasicAppCard/BasicAppCard";
import ExtendedAppCard from "../ExtendedAppCard/ExtendedAppCard";
import DetailedAppCard from "../DetailedAppCard/DetailedAppCard";

interface LibraryViewProps {
    apps: AppInfo[];
    handleMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, app: AppInfo) => void | null;
    handleMouseLeave?: () => void | null;
}

type ViewMode = "small" | "medium" | "list";

const AppList = ({ apps, handleMouseEnter, handleMouseLeave }: LibraryViewProps) => {

    const [viewMode, setViewMode] = useState<ViewMode>("list");

    const checkViewMode = () => {
        if (viewMode === "small") {
            return styles.appMosaicList;
        } else if (viewMode === "medium") {
            return styles.appOtherList;
        }
        return styles.appList;
    };

    const renderApps = (app: AppInfo) => {
        switch (viewMode) {
            case "small":
                return (
                    <BasicAppCard
                        key={app.id}
                        app={app}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                    />
                );
            case "medium":
                return (
                    <ExtendedAppCard
                        key={app.id}
                        app={app}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                    />
                );
            case "list":
            default:
                return <DetailedAppCard key={app.id} app={app} />;
        }
    };

    // --- Estado ---
    const [filteredApps, setFilteredApps] = useState<AppInfo[]>(dummyAppData); // Lista a mostrar
    const [searchTerm, setSearchTerm] = useState<string>('');
    // Añade estados para otros filtros si es necesario (categoría, orden, etc.)
    // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    // const [sortOrder, setSortOrder] = useState<string>('default');

    // --- Efecto para filtrar y ordenar ---
    // useEffect(() => {
    //     let result = apps;

    //     // 1. Filtrar por término de búsqueda
    //     if (searchTerm.trim() !== '') {
    //         result = result.filter(app =>
    //             app.name.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //     }

    //     // 2. Filtrar por categoría (ejemplo)
    //     // if (selectedCategory) {
    //     //   result = result.filter(app => app.category === selectedCategory);
    //     // }

    //     // 3. Ordenar (ejemplo)
    //     // if (sortOrder === 'nameAsc') {
    //     //   result = result.sort((a, b) => a.name.localeCompare(b.name));
    //     // } else if (sortOrder === 'dateDesc') {
    //     //   result = result.sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''));
    //     // }

    //     setFilteredApps(result);

    // }, [searchTerm, apps /*, selectedCategory, sortOrder */]); // Dependencias del efecto

    // --- Handlers ---
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    // Handlers para otros filtros/ordenamientos
    // const handleCategoryChange = (category: string | null) => { ... }
    // const handleSortChange = (order: string) => { ... }

    // --- Renderizado ---
    return (
        // Usa la clase del CSS Module
        <div className={styles.libraryViewContainer}>

            {/* Área para SearchBar y quizás otros controles superiores */}
            <div className={styles.topControls}>
                {/* Placeholder para SearchBar */}
                <div className={styles.placeholderSearchBar}>
                    SearchBar (pendiente) - Término: {searchTerm}
                </div>
            </div>

            {/* Área para FilterControls */}
            <div className={styles.filterControls}>
                {/* Placeholder para FilterControls */}
                <div className={styles.placeholderFilterControls}>
                    FilterControls (pendiente) - Vista: {viewMode}
                    <button onClick={() => handleViewModeChange('small')}>Grid</button>
                    <button onClick={() => handleViewModeChange('medium')}>Detailed Grid</button>
                    <button onClick={() => handleViewModeChange('list')}>List</button>
                </div>
            </div>

            {/* Área para AppDisplayArea */}
            <div className={checkViewMode()}>
                {apps.map((app) => renderApps(app))}
            </div>

        </div>
    );
};

export default AppList;