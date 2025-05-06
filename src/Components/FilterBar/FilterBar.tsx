/* eslint-disable no-unused-vars */
import style from "./FilterBar.module.css";
import { useEffect, useRef, useState } from "react";

interface FilterProps {
  handleViewMode: (mode: string) => void;
}

const Filter = ({ handleViewMode }: FilterProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Para detectar clics fuera
  const buttonRef = useRef<HTMLButtonElement>(null); // Para referencia del botón

  const toggleDropdown = () => {
    setIsDropdownOpen((prev: boolean) => !prev);
  };

  const handleSelectOption = (mode: string) => {
    handleViewMode(mode);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className={style.container}>
      <button className={style.filterButton}>Categoría</button>
      <button className={style.filterButton}>Fecha</button>
      <button className={style.filterButton}>Ordenar</button>
      <div className={style.dropdownContainer}>
        <button
          ref={buttonRef}
          className={`${style.filterButton} ${style.mostrarButton}`}
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          Mostrar {isDropdownOpen ? "▲" : "▼"}
        </button>
        {isDropdownOpen && (
          <div ref={dropdownRef} className={style.dropdownMenu}>
            <button
              value={"small"}
              className={style.dropdownItem}
              onClick={(e) => handleSelectOption(e.currentTarget.value)}
            >
              Mosaico
            </button>
            <button
              value={"medium"}
              className={style.dropdownItem}
              onClick={(e) => handleSelectOption(e.currentTarget.value)}
            >
              Lista
            </button>
            <button
              value={"list"}
              className={style.dropdownItem}
              onClick={(e) => handleSelectOption(e.currentTarget.value)}
            >
              Detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
