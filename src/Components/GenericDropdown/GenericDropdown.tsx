/* eslint-disable no-unused-vars */
import React, { ReactNode } from "react";
import style from "./GenericDropdown.module.css"; // Estilos específicos para el dropdown

interface GenericDropdownProps {
  id: string; // Para identificar el dropdown
  buttonContent: ReactNode; // Contenido del botón (ej. "Categoría")
  buttonBaseClassName?: string; // Clase base para el botón (ej. style.filterButton de FilterBar)
  buttonSpecificClassName?: string; // Clases adicionales para este botón específico
  children: ReactNode; // Contenido del menú desplegable
  isActive: boolean; // Si este dropdown está actualmente activo/abierto
  onToggle: (id: string) => void; // Función para llamar al hacer clic en el botón
  buttonRef: React.RefObject<HTMLButtonElement>; // Ref para el botón
  menuRef: React.RefObject<HTMLDivElement>; // Ref para el contenedor del menú
  menuContainerClassName?: string; // Clase adicional para el contenedor del menú
  menuAlign?: "left" | "right"; // Alineación del menú
}

const GenericDropdown = ({
  id,
  buttonContent,
  buttonBaseClassName,
  buttonSpecificClassName,
  children,
  isActive,
  onToggle,
  buttonRef,
  menuRef,
  menuContainerClassName,
  menuAlign = "left",
}: GenericDropdownProps) => {
  return (
    <div className={style.dropdownWrapper}>
      <button
        ref={buttonRef}
        className={`${buttonBaseClassName || ""} ${buttonSpecificClassName || ""} ${isActive ? style.activeButton : ""}`}
        onClick={() => onToggle(id)}
        aria-haspopup="true"
        aria-expanded={isActive}
      >
        {buttonContent} <span className={style.arrow}>{isActive ? "▲" : "▼"}</span>
      </button>
      {isActive && (
        <div
          ref={menuRef}
          className={`${style.menuBase} ${menuContainerClassName || ""} ${menuAlign === "right" ? style.menuAlignRight : style.menuAlignLeft}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default GenericDropdown;
