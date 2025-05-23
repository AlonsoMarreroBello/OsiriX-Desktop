import { Box, Modal, Switch } from "@mui/material";
import style from "./SettingsModal.module.css";
import { Bedtime, Close as CloseIcon, Settings, Sunny } from "@mui/icons-material";
import { useState } from "react";
interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const iconStyle = {
    fontSize: "2rem", // Tamaño del icono interno (Sol/Luna)
    color: darkMode ? "var(--text-primary)" : "var(--text-alternative)",
    backgroundColor: darkMode ? "var(--bg-tertiary)" : "var(--bg-secondary)",
    borderRadius: "50%",
    border: "1px solid var(--text-primary)",
    padding: "0.5rem",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="friends-modal-title"
      aria-describedby="friends-modal-description"
      sx={{ zIndex: 1200 }}
    >
      <Box className={style.muiModalBoxStyled}>
        <button onClick={onClose} className={style.closeButton} aria-label="Cerrar modal">
          <CloseIcon sx={{ fontSize: "2.2rem" }} />
        </button>
        <div className={style.content}>
          <Settings sx={{ fontSize: "4.5rem", color: "var(--text-primary)" }} />

          <div className={style.themeSwitchContainer}>
            <p className={style.themeSwitchText}>Modo {darkMode ? "oscuro" : "claro"}</p>
            <Switch
              icon={<Sunny sx={iconStyle} />}
              checkedIcon={<Bedtime sx={iconStyle} />}
              value={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              sx={{
                height: 60,
                width: 90,
                padding: "1rem",
              }}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
