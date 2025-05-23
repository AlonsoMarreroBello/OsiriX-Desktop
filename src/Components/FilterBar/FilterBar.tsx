/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import mainStyle from "./FilterBar.module.css"; // Estilos para el .container y otros elementos no MUI
import InputField from "../InputField/InputField";
import { Category } from "../../interfaces/Category";
import { Checkbox, Radio, Button, Menu, MenuItem } from "@mui/material"; // Box es opcional si no lo usas para el container
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewListIcon from "@mui/icons-material/ViewList";
import categoryService from "../../services/CategoryService";
import appService from "../../services/AppService";
import AppInfo from "../../interfaces/AppInfo";
import {
  CategoryTab,
  sortCriteriaOptions,
  SortOrderOption,
  sortOrderOptions,
  commonFilterButtonSx,
  commonFilterButtonActiveSx,
  menuPaperProps,
  viewOptions,
  ViewMode,
} from "../../models/FilterModel";
import { GridView } from "@mui/icons-material";

interface FilterBarProps {
  apps: AppInfo[];
  viewMode: ViewMode;
  handleViewMode: (mode: string) => void;
  setApps: (apps: AppInfo[]) => void;
}

const FilterBar = ({ apps: currentApps, viewMode, handleViewMode, setApps }: FilterBarProps) => {
  const [anchorElCategory, setAnchorElCategory] = useState<null | HTMLElement>(null);
  const [anchorElDate, setAnchorElDate] = useState<null | HTMLElement>(null);
  const [anchorElSort, setAnchorElSort] = useState<null | HTMLElement>(null);
  const [anchorElView, setAnchorElView] = useState<null | HTMLElement>(null);

  const [categoryTab, setCategoryTab] = useState<CategoryTab>("GAME");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedGameCategories, setSelectedGameCategories] = useState<number[]>([]);
  const [selectedAppCategories, setSelectedAppCategories] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>(sortOrderOptions[0]?.value || "asc");

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  ) => {
    setter(event.currentTarget);
  };
  const handleCloseMenu = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => {
    setter(null);
  };

  const getCategories = async () => {
    try {
      const allCategories = await categoryService.getCategories();
      const filteredCats = allCategories.filter((cat) =>
        categoryTab === "GAME" ? cat.categoryType === "GAME" : cat.categoryType === "APP"
      );
      setCategories(filteredCats);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, [categoryTab]);

  const handleCategoryTabs = (tab: CategoryTab) => {
    setCategoryTab(tab);
  };

  const handleCategoryCheckboxChange = (categoryId: number) => {
    const currentSelected = categoryTab === "GAME" ? selectedGameCategories : selectedAppCategories;
    const setter = categoryTab === "GAME" ? setSelectedGameCategories : setSelectedAppCategories;
    setter(
      currentSelected.includes(categoryId)
        ? currentSelected.filter((id) => id !== categoryId)
        : [...currentSelected, categoryId]
    );
  };

  const applyCategoryFilters = async () => {
    const idsToFilter = categoryTab === "GAME" ? selectedGameCategories : selectedAppCategories;
    try {
      let fetchedApps: AppInfo[];
      if (idsToFilter.length > 0) {
        fetchedApps = await appService.getAppsByCategoryIds(idsToFilter);
      } else {
        fetchedApps = await appService.getApps();
      }
      const appsWithImgs = await Promise.all(
        fetchedApps.map(async (app: AppInfo) => {
          const appImgUrl = await appService.getImageByAppId(app.appId, "icono");
          return { ...app, imgUrl: appImgUrl };
        })
      );
      setApps(appsWithImgs);
    } catch (error) {
      console.error("Error applying category filters:", error);
      const fallbackApps = await appService.getApps();
      setApps(fallbackApps);
    }
    handleCloseMenu(setAnchorElCategory);
  };

  const cancelCategoryFilters = () => handleCloseMenu(setAnchorElCategory);

  const applyDateFilters = () => {
    let appsToFilter = [...currentApps]; // Trabaja sobre una copia de las apps actuales

    if (startDate || endDate) {
      const startFilterDate = startDate ? new Date(startDate) : null;
      const endFilterDate = endDate ? new Date(endDate) : null;

      // Ajustar las fechas de filtro para que incluyan todo el día
      // Para startDate, queremos comparar desde el inicio del día (00:00:00)
      // Para endDate, queremos comparar hasta el final del día (23:59:59)
      if (startFilterDate) startFilterDate.setHours(0, 0, 0, 0);
      if (endFilterDate) endFilterDate.setHours(23, 59, 59, 999);

      appsToFilter = appsToFilter.filter((app) => {
        // publicationDate ya es un objeto Date en AppInfo
        const pubDate = new Date(app.publicationDate);

        const passesStartDate = startFilterDate ? pubDate >= startFilterDate : true;
        const passesEndDate = endFilterDate ? pubDate <= endFilterDate : true;

        return passesStartDate && passesEndDate;
      });
    }

    setApps(appsToFilter); // Actualiza el estado en el componente padre
    handleCloseMenu(setAnchorElDate);
  };
  const cancelDateFilters = () => {
    setStartDate("");
    setEndDate("");
    handleCloseMenu(setAnchorElDate);
  };

  const handleSortByCheckboxChange = (criteria: string) => {
    setSelectedSortBy((prev) =>
      prev.includes(criteria) ? prev.filter((c) => c !== criteria) : [...prev, criteria]
    );
  };

  // MODIFICADO: Implementación de ordenamiento en el frontend
  const applySortFilters = () => {
    const appsToSort = [...currentApps]; // Trabaja sobre una copia de las apps actuales

    if (selectedSortBy.length > 0) {
      appsToSort.sort((a, b) => {
        for (const criteria of selectedSortBy) {
          // Asegúrate que 'criteria' sea una clave válida de AppInfo.
          // Ej: 'name', 'publicationDate', 'downloads'
          // Si usas nombres amigables en sortCriteriaOptions, necesitarás un mapeo aquí.
          // ej: if (criteria === "Nombre") key = "name";
          const key = criteria as keyof AppInfo; // Asumimos que criteria es una key válida

          let valA = a[key];
          let valB = b[key];

          // Manejo específico para tipos de datos
          if (key === "publicationDate") {
            valA = new Date(a.publicationDate).getTime();
            valB = new Date(b.publicationDate).getTime();
          } else if (key === "downloads") {
            valA = a.downloads ?? 0; // Tratar null/undefined como 0
            valB = b.downloads ?? 0;
          } else if (typeof valA === "string" && typeof valB === "string") {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
          }

          let comparison = 0;
          if (valA < valB) {
            comparison = -1;
          } else if (valA > valB) {
            comparison = 1;
          }

          if (comparison !== 0) {
            return sortOrder === "asc" ? comparison : comparison * -1;
          }
        }
        return 0; // Si todos los criterios de orden son iguales
      });
    }

    setApps(appsToSort); // Actualiza el estado en el componente padre
    handleCloseMenu(setAnchorElSort);
  };

  const cancelSortFilters = () => {
    setSelectedSortBy([]);
    // setSortOrder(sortOrderOptions[0]?.value || "asc"); // Opcional: resetear orden
    // Similar a cancelDateFilters, resetear el orden puede ser complejo
    // si se combina con otros filtros. Por ahora, solo cierra.
    handleCloseMenu(setAnchorElSort);
  };

  const handleSelectViewOption = (mode: string) => {
    handleViewMode(mode);
    handleCloseMenu(setAnchorElView);
  };

  const handleViewIcon = (mode: string) => {
    switch (mode) {
      case "mosaico":
        return <GridView />;
      case "lista":
        return <ViewComfyIcon />;
      case "detalles":
        return <ViewListIcon />;
      default:
        return <AutoAwesomeMosaicIcon />;
    }
  };
  // --- Contenido de los Dropdowns (sin cambios aquí) ---
  const categoryDropdownContent = (
    <div className={`${mainStyle.dropdownContent} ${mainStyle.dropdownCategoryMenu}`}>
      {" "}
      {/* Clase específica para este dropdown */}
      <div className={mainStyle.categoryTabs}>
        <button
          className={`${mainStyle.tabButton} ${categoryTab === "GAME" ? mainStyle.activeTab : ""}`}
          onClick={() => handleCategoryTabs("GAME")}
        >
          Juegos
        </button>
        <button
          className={`${mainStyle.tabButton} ${categoryTab === "APP" ? mainStyle.activeTab : ""}`}
          onClick={() => handleCategoryTabs("APP")}
        >
          Aplicaciones
        </button>
      </div>
      <div className={mainStyle.categoryListContainer}>
        <div className={mainStyle.checkboxGridCategory}>
          {" "}
          {categories.length > 0 ? (
            categories.map((cat: Category) => (
              <label key={cat.categoryId} className={mainStyle.checkboxLabelStyled}>
                <Checkbox
                  checked={(categoryTab === "GAME"
                    ? selectedGameCategories
                    : selectedAppCategories
                  ).includes(cat.categoryId)}
                  onChange={() => handleCategoryCheckboxChange(cat.categoryId)}
                  sx={{
                    padding: "4px",
                    color: "var(--color-text-primary)",
                    "&.Mui-checked": { color: "var(--color-accent-pastel-main)" },
                    "& .MuiSvgIcon-root": { fontSize: "1.2rem" },
                  }}
                />
                <span className={mainStyle.checkboxText}>{cat.categoryName}</span>
              </label>
            ))
          ) : (
            <p className={mainStyle.noItemsMessageFullWidth}>
              No hay categorías {categoryTab === "GAME" ? "de juegos" : "de aplicaciones"}{" "}
              disponibles.
            </p>
          )}
        </div>
      </div>
      <div className={mainStyle.dropdownActions}>
        {" "}
        {/* Clase específica para acciones de este dropdown */}
        <button
          onClick={cancelCategoryFilters}
          className={`${mainStyle.actionButton} ${mainStyle.cancelButton}`}
        >
          Cancelar
        </button>
        <button
          onClick={applyCategoryFilters}
          className={`${mainStyle.actionButton} ${mainStyle.applyButton}`}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  const dateDropdownContent = (
    <div className={mainStyle.dropdownContent}>
      {/* ... tu contenido ... */}
      <div className={mainStyle.dateInputWrapper}>
        <InputField
          label="Fecha de Inicio"
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <InputField
          label="Fecha final"
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className={mainStyle.dropdownActions}>
        <button
          onClick={cancelDateFilters}
          className={`${mainStyle.actionButton} ${mainStyle.cancelButton}`}
        >
          Cancelar
        </button>
        <button
          onClick={applyDateFilters}
          className={`${mainStyle.actionButton} ${mainStyle.applyButton}`}
        >
          Aplicar Fechas
        </button>
      </div>
    </div>
  );

  const sortDropdownContent = (
    // No es necesario un wrapper div adicional si .dropdownContent ya da el padding
    // Si necesitas un padding muy específico para este, usa una clase como mainStyle.dropdownContentSort
    <div className={`${mainStyle.dropdownContent} ${mainStyle.dropdownContentSort}`}>
      {" "}
      {/* Usando la clase genérica para padding */}
      <div className={mainStyle.sortSectionsContainer}>
        <div className={mainStyle.sectionTitleContainer}>
          <p className={mainStyle.sectionTitle}>Ordenar por:</p>
          <p className={mainStyle.sectionTitle}>Orden:</p>
        </div>
        <div className={mainStyle.sortContentWrapper}>
          <div className={mainStyle.sortCriteriaSection}>
            {sortCriteriaOptions.map((crit) => (
              <label key={crit} className={mainStyle.checkboxLabelStyled}>
                {" "}
                {/* Reutilizando checkboxLabelStyled */}
                <Checkbox
                  checked={selectedSortBy.includes(crit)}
                  onChange={() => handleSortByCheckboxChange(crit)}
                  sx={{
                    padding: "4px", // Consistente con categoría
                    color: "var(--color-text-primary)",
                    "&.Mui-checked": { color: "var(--color-accent-pastel-main)" },
                    "& .MuiSvgIcon-root": { fontSize: "1.2rem" }, // Consistente con categoría
                  }}
                />
                <span className={mainStyle.checkboxText}>{crit}</span>{" "}
                {/* Reutilizando checkboxText */}
              </label>
            ))}
          </div>
          <div className={mainStyle.borderTabVertical}></div> {/* Separador vertical */}
          <div className={mainStyle.sortOrderSection}>
            {sortOrderOptions.map((option: SortOrderOption) => (
              // Usaremos una clase similar a checkboxLabelStyled para los radios, o la misma si el estilo es idéntico
              <label key={option.value} className={mainStyle.checkboxLabelStyled}>
                {" "}
                {/* Nueva clase para consistencia */}
                <Radio
                  checked={sortOrder === option.value}
                  onChange={() => setSortOrder(option.value)}
                  value={option.value}
                  sx={{
                    padding: "4px", // Consistente
                    color: "var(--color-text-primary)",
                    "&.Mui-checked": { color: "var(--color-accent-pastel-main)" },
                    "& .MuiSvgIcon-root": { fontSize: "1.2rem" }, // Consistente
                  }}
                />
                <span className={mainStyle.checkboxText}>{option.label}</span>{" "}
                {/* Nueva clase para consistencia */}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className={mainStyle.dropdownActions}>
        {" "}
        {/* Usando la clase genérica */}
        <button
          onClick={cancelSortFilters}
          className={`${mainStyle.actionButton} ${mainStyle.cancelButton}`}
        >
          Cancelar
        </button>
        <button
          onClick={applySortFilters}
          className={`${mainStyle.actionButton} ${mainStyle.applyButton}`}
        >
          Aplicar Orden
        </button>
      </div>
    </div>
  );

  // --- FIN Contenido de los Dropdowns ---

  return (
    <div className={mainStyle.container}>
      {" "}
      {/* Estilos del container se mantienen en CSS Module */}
      <Button
        id="category-button"
        aria-controls={anchorElCategory ? "category-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorElCategory)}
        onClick={(e) => handleOpenMenu(e, setAnchorElCategory)}
        endIcon={anchorElCategory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          ...commonFilterButtonSx,
          ...(anchorElCategory && commonFilterButtonActiveSx),
        }}
      >
        Categoría
      </Button>
      <Menu
        id="category-menu"
        anchorEl={anchorElCategory}
        open={Boolean(anchorElCategory)}
        onClose={() => handleCloseMenu(setAnchorElCategory)}
        MenuListProps={{ "aria-labelledby": "category-button" }}
        PaperProps={{ ...menuPaperProps, className: mainStyle.dropdownMenuContainerWide }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {categoryDropdownContent}
      </Menu>
      <Button
        id="date-button"
        aria-controls={anchorElDate ? "date-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorElDate)}
        onClick={(e) => handleOpenMenu(e, setAnchorElDate)}
        endIcon={anchorElDate ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          ...commonFilterButtonSx,
          ...(anchorElDate && commonFilterButtonActiveSx),
        }}
      >
        Fecha
      </Button>
      <Menu
        id="date-menu"
        anchorEl={anchorElDate}
        open={Boolean(anchorElDate)}
        onClose={() => handleCloseMenu(setAnchorElDate)}
        MenuListProps={{ "aria-labelledby": "date-button" }}
        PaperProps={{ ...menuPaperProps, className: mainStyle.dropdownMenuContainer }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {dateDropdownContent}
      </Menu>
      <Button
        id="sort-button"
        aria-controls={anchorElSort ? "sort-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorElSort)}
        onClick={(e) => handleOpenMenu(e, setAnchorElSort)}
        endIcon={anchorElSort ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          ...commonFilterButtonSx,
          ...(anchorElSort && commonFilterButtonActiveSx),
        }}
      >
        Ordenar
      </Button>
      <Menu
        id="sort-menu"
        anchorEl={anchorElSort}
        open={Boolean(anchorElSort)}
        onClose={() => handleCloseMenu(setAnchorElSort)}
        MenuListProps={{ "aria-labelledby": "sort-button" }}
        PaperProps={{ ...menuPaperProps, className: mainStyle.dropdownMenuContainerWide }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {sortDropdownContent}
      </Menu>
      <Button
        id="view-button"
        aria-controls={anchorElView ? "view-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorElView)}
        onClick={(e) => handleOpenMenu(e, setAnchorElView)}
        sx={{
          ...commonFilterButtonSx,
          ...(anchorElView && commonFilterButtonActiveSx),
        }}
      >
        {handleViewIcon(viewMode)}
      </Button>
      <Menu
        id="view-menu"
        anchorEl={anchorElView}
        open={Boolean(anchorElView)}
        onClose={() => handleCloseMenu(setAnchorElView)}
        MenuListProps={{ "aria-labelledby": "view-button" }}
        PaperProps={{ ...menuPaperProps, className: mainStyle.dropdownMenuContainerNarrow }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {viewOptions.map((option) => (
          <MenuItem key={option.value} onClick={() => handleSelectViewOption(option.value)}>
            {handleViewIcon(option.value)}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterBar;
