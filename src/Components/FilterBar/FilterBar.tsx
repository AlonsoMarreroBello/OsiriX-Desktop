/* eslint-disable no-unused-vars */
import mainStyle from "./FilterBar.module.css";
import GenericDropdown from "../GenericDropdown/GenericDropdown";
import { useEffect, useRef, useState } from "react";
import InputField from "../InputField/InputField";
import { Category } from "../../interfaces/Category";
import { allGameCategories, allAppCategories } from "../../data/FakeData";
import { Checkbox, Radio } from "@mui/material";

interface FilterBarProps {
  handleViewMode: (mode: string) => void;
}
type CategoryTab = "games" | "apps";

export type ViewMode = "mosaico" | "lista" | "detalles";

const sortOrderOptions = ["Ascendente", "Descendente", "sHufFle"];

const sortCriteriaOptions = [
  "Fecha de lanzamiento",
  "Descargas",
  "Tamaño de archivo",
  "Nombre de la app",
  "Última actualización",
];
const FilterBar = ({ handleViewMode }: FilterBarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // Objeto para almacenar refs de botones y menús
  const dropdownRefs = {
    category: { button: useRef<HTMLButtonElement>(null), menu: useRef<HTMLDivElement>(null) },
    date: { button: useRef<HTMLButtonElement>(null), menu: useRef<HTMLDivElement>(null) },
    sort: { button: useRef<HTMLButtonElement>(null), menu: useRef<HTMLDivElement>(null) },
    view: { button: useRef<HTMLButtonElement>(null), menu: useRef<HTMLDivElement>(null) },
  };
  // useStates para manejar los filtros
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("games");
  const [selectedGameCategories, setSelectedGameCategories] = useState<number[]>([]);
  const [selectedAppCategories, setSelectedAppCategories] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("");

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };
  const closeActiveDropdown = () => setActiveDropdown(null);

  // manejar el cierre de los dropdowns al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!activeDropdown) return;
      const currentRefs = dropdownRefs[activeDropdown as keyof typeof dropdownRefs];
      if (
        currentRefs &&
        currentRefs.menu.current &&
        !currentRefs.menu.current.contains(event.target as Node) &&
        currentRefs.button.current &&
        !currentRefs.button.current.contains(event.target as Node)
      ) {
        closeActiveDropdown();
      }
    };
    if (activeDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // --- Manejadores para filtros (cerrando los dropdowns tambien) ---
  const handleCategoryCheckboxChange = (categoryId: number, type: CategoryTab) => {
    const setter = type === "games" ? setSelectedGameCategories : setSelectedAppCategories;
    setter((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };
  const applyCategoryFilters = () => {
    console.log("Nombre de las categorías aplicadas:", getCategories());
    closeActiveDropdown();
  };
  const cancelCategoryFilters = () => closeActiveDropdown();

  const applyDateFilters = () => {
    console.log("Fechas aplicadas:", { startDate, endDate });
    closeActiveDropdown();
  };
  const cancelDateFilters = () => closeActiveDropdown();

  const handleSortByCheckboxChange = (criteria: string) => {
    setSelectedSortBy((prev) =>
      prev.includes(criteria) ? prev.filter((c) => c !== criteria) : [...prev, criteria]
    );
  };
  const applySortFilters = () => {
    console.log("Orden aplicado:", { sortBy: selectedSortBy, order: sortOrder });
    closeActiveDropdown();
  };
  const cancelSortFilters = () => closeActiveDropdown();

  const handleSelectViewOption = (mode: string) => {
    handleViewMode(mode);
    closeActiveDropdown();
  };

  const getCategories = () => {
    const selectedCategories: Category[] = [];

    const categoriesId = categoryTab === "games" ? allGameCategories : allAppCategories;

    categoriesId.forEach((cat) => {
      if (selectedGameCategories.includes(cat.categoryId)) {
        selectedCategories.push(cat);
      } else if (selectedAppCategories.includes(cat.categoryId)) {
        selectedCategories.push(cat);
      }
    });
    return selectedCategories;
  };

  // contenido de los dropdowns
  const categoryDropdownContent = (
    <div className={mainStyle.dropdownContent}>
      <div className={mainStyle.categoryTabs}>
        <button
          className={`${mainStyle.tabButton} ${categoryTab === "games" ? mainStyle.activeTab : ""}`}
          onClick={() => setCategoryTab("games")}
        >
          Juegos
        </button>
        <div className={mainStyle.borderTab}></div>
        <button
          className={`${mainStyle.tabButton} ${categoryTab === "apps" ? mainStyle.activeTab : ""}`}
          onClick={() => setCategoryTab("apps")}
        >
          Aplicaciones
        </button>
      </div>
      <div className={mainStyle.checkboxGrid}>
        {(categoryTab === "games" ? allGameCategories : allAppCategories).map((cat) => (
          <label key={cat.categoryId} className={mainStyle.checkboxLabel}>
            <Checkbox
              checked={(categoryTab === "games"
                ? selectedGameCategories
                : selectedAppCategories
              ).includes(cat.categoryId)}
              onChange={() => handleCategoryCheckboxChange(cat.categoryId, categoryTab)}
              sx={{
                color: "var(--text-primary)",
                "&.Mui-checked": {
                  color: "var(--text-alternative)",
                },
              }}
            />
            {cat.categoryName}
          </label>
        ))}
      </div>
      <div className={mainStyle.dropdownActions}>
        <button onClick={cancelCategoryFilters} className={mainStyle.actionButton}>
          Cancelar
        </button>
        <button onClick={applyCategoryFilters} className={`${mainStyle.actionButton}`}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  const dateDropdownContent = (
    <div className={mainStyle.dropdownContent}>
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
      <div className={mainStyle.dropdownActions}>
        <button onClick={cancelDateFilters} className={mainStyle.actionButton}>
          Cancelar
        </button>
        <button onClick={applyDateFilters} className={`${mainStyle.actionButton}`}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  const sortDropdownContent = (
    <div className={mainStyle.dropdownContent}>
      <div className={mainStyle.sortSectionsContainer}>
        <div className={mainStyle.sortCriteriaSection}>
          {sortCriteriaOptions.map((crit) => (
            <label key={crit} className={mainStyle.checkboxLabel}>
              <Checkbox
                checked={selectedSortBy.includes(crit)}
                onChange={() => handleSortByCheckboxChange(crit)}
                sx={{
                  color: "var(--text-primary)",
                  "&.Mui-checked": {
                    color: "var(--text-alternative)",
                  },
                }}
              />
              {crit}
            </label>
          ))}
        </div>
        <div className={mainStyle.borderTab}></div>
        <div className={mainStyle.sortOrderSection}>
          {sortOrderOptions.map((order) => (
            <label key={order.toLowerCase()} className={mainStyle.radioLabel}>
              <Radio
                checked={sortOrder === order.toLowerCase()}
                onChange={() => setSortOrder(order.toLowerCase())}
                sx={{
                  color: "var(--text-primary)",
                  "&.Mui-checked": {
                    color: "var(--text-alternative)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.5rem",
                  },
                }}
              />
              {order}
            </label>
          ))}
        </div>
      </div>
      <div className={mainStyle.dropdownActions}>
        <button onClick={cancelSortFilters} className={mainStyle.actionButton}>
          Cancelar
        </button>
        <button
          onClick={applySortFilters}
          className={`${mainStyle.actionButton} ${mainStyle.applyButton}`}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  const viewDropdownContent = (
    <>
      {["Mosaico", "Lista", "Detalles"].map((viewMode, index) => (
        <button
          key={index}
          value={viewMode.toLowerCase().replace(" ", "")}
          className={mainStyle.dropdownItem}
          onClick={(e) => handleSelectViewOption(e.currentTarget.value)}
        >
          {viewMode}
        </button>
      ))}
    </>
  );

  return (
    <div className={mainStyle.container}>
      <GenericDropdown
        id="category"
        buttonContent="Categoría"
        buttonBaseClassName={mainStyle.filterButton}
        isActive={activeDropdown === "category"}
        onToggle={toggleDropdown}
        buttonRef={dropdownRefs.category.button}
        menuRef={dropdownRefs.category.menu}
        menuContainerClassName={mainStyle.dropdownMenuContainer} // Clase para estilizar el contenedor del menú de categoría
      >
        {categoryDropdownContent}
      </GenericDropdown>

      <GenericDropdown
        id="date"
        buttonContent="Fecha"
        buttonBaseClassName={mainStyle.filterButton}
        isActive={activeDropdown === "date"}
        onToggle={toggleDropdown}
        buttonRef={dropdownRefs.date.button}
        menuRef={dropdownRefs.date.menu}
        menuContainerClassName={mainStyle.dropdownMenuContainer}
      >
        {dateDropdownContent}
      </GenericDropdown>

      <GenericDropdown
        id="sort"
        buttonContent="Ordenar"
        buttonBaseClassName={mainStyle.filterButton}
        isActive={activeDropdown === "sort"}
        onToggle={toggleDropdown}
        buttonRef={dropdownRefs.sort.button}
        menuRef={dropdownRefs.sort.menu}
        menuContainerClassName={mainStyle.dropdownMenuContainer}
      >
        {sortDropdownContent}
      </GenericDropdown>

      <GenericDropdown
        id="view"
        buttonContent="Mostrar"
        buttonBaseClassName={mainStyle.filterButton}
        isActive={activeDropdown === "view"}
        onToggle={toggleDropdown}
        buttonRef={dropdownRefs.view.button}
        menuRef={dropdownRefs.view.menu}
      >
        {viewDropdownContent}
      </GenericDropdown>
    </div>
  );
};

export default FilterBar;
