import { Box, Modal } from "@mui/material";
import style from "./RedeemModal.module.css";
import { Close as CloseIcon } from "@mui/icons-material";
import InputField from "../../../components/InputField/InputField";
import { useState } from "react";
interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
}

const RedeemModal = ({ open, onClose }: RedeemModalProps) => {
  const [redeemCode, setRedeemCode] = useState<string>("");
  const handleRedeemCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedeemCode(e.target.value);
  };

  const sendRedeemCode = () => {
    console.log("Código de canje: ", redeemCode);
    onClose();
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
          <h2 className={style.titleText}>Introduzca el código</h2>
          <InputField
            id="redeem-code"
            type="text"
            value={redeemCode}
            onChange={handleRedeemCodeChange}
            placeholder="Código de canjeo"
          />
          <div className={style.actionButtonsContainer}>
            <button onClick={onClose} className={`${style.actionButton} ${style.cancelButton}`}>
              Cancelar
            </button>
            <button
              onClick={sendRedeemCode}
              className={`${style.actionButton} ${style.applyButton}`}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default RedeemModal;
