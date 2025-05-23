import React, { useState } from "react";
import styles from "./DownloadProgress.module.css"; // Asegúrate que el nombre del archivo CSS coincida
import { DownloadOutlined } from "@mui/icons-material"; // Icono fijo

interface DownloadProgressProps {
  appName: string;
  progress: number;
  currentIndex?: number;
  totalItems?: number;
  initialSize?: number;
  strokeWidth?: number;
}

const DownloadProgress = ({
  appName,
  progress,
  currentIndex,
  totalItems,
  initialSize = 50,
  strokeWidth = 4,
}: DownloadProgressProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const radius = (initialSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  const indexText =
    currentIndex !== undefined && totalItems !== undefined
      ? `Descarga ${currentIndex + 1} de ${totalItems}`
      : null;

  const handleToggleExpand = () => setIsExpanded(!isExpanded);
  const handleMainClick = handleToggleExpand;

  const containerClasses = `${styles.container} ${isExpanded ? styles.expanded : styles.collapsed}`;
  const containerStyle: React.CSSProperties = !isExpanded
    ? { width: `${initialSize}px`, height: `${initialSize}px` }
    : {};

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      onClick={handleMainClick}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${appName} - ${clampedProgress}%`}
    >
      {/* --- SVG Círculo (Colapsado) --- */}
      <svg
        className={`${styles.svgProgress} ${isExpanded ? styles.hidden : ""}`}
        width={initialSize}
        height={initialSize}
        viewBox={`0 0 ${initialSize} ${initialSize}`}
      >
        <circle
          className={styles.progressTrack}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={initialSize / 2}
          cy={initialSize / 2}
        />
        <circle
          className={styles.progressBar}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={initialSize / 2}
          cy={initialSize / 2}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>

      {/* --- Icono Principal --- */}
      <div className={styles.iconContainer}>
        <DownloadOutlined className={styles.icon} />
      </div>

      {/* --- Sección de Detalles (Expandido) - REESTRUCTURADA --- */}
      <div className={`${styles.detailsSection} ${!isExpanded ? styles.hidden : ""}`}>
        {/* 1. Texto de Estado (arriba) */}
        <span className={styles.statusText}>Descarga en curso</span>

        {/* 2. Fila con Porcentaje y Nombre (en medio) */}
        <div className={styles.progressMetaRow}>
          <span className={styles.appName}>{appName}</span>
        </div>

        {/* 3. Barra de Progreso Lineal (debajo de la fila anterior) */}
        <div className={styles.linearProgressBarContainer}>
          <span className={styles.percentage}>{`${clampedProgress}%`}</span>
          <div className={styles.linearProgressBarTrack}>
            <div
              className={styles.linearProgressBarFill}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

        {/* 4. Texto de Índice (abajo, opcional) */}
        {indexText && <div className={styles.indexText}>{indexText}</div>}
      </div>
    </div>
  );
};

export default DownloadProgress;
