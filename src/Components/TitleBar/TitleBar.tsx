import { useEffect, useState } from "react";
import style from "./TitleBar.module.css";
import logo from "../../assets/bobCholo.jpeg";
import { AddBoxOutlined, PeopleAlt, PublishOutlined, Settings } from "@mui/icons-material";
import FriendModal from "../Modals/FriendModal/FriendModal";
import SettingsModal from "../Modals/SettingsModal/SettingsModal";
export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [openFriendModal, setOpenFriendModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const handleOpenFriendModal = () => setOpenFriendModal(true);
  const handleCloseFriendModal = () => setOpenFriendModal(false);
  const handleOpenSettingsModal = () => setOpenSettingsModal(true);
  const handleCloseSettingsModal = () => setOpenSettingsModal(false);
  useEffect(() => {
    window.electron.isMaximized(setIsMaximized);
  }, []);

  return (
    <div className={style.titleBar}>
      <div className={style.actionsContainer}>
        <div className={style.linkActions}>
          <div className={style.actionInnerContainer}>
            <img src={logo} alt="logo" className={style.logo} />
            <p className={style.actionText}>Osirix</p>
          </div>
          <div className={style.actionInnerContainer}>
            <Settings className={style.icon} />
            <button onClick={handleOpenSettingsModal}>
              <p className={style.actionText}>Ajustes</p>
            </button>
          </div>
          <div className={style.actionInnerContainer}>
            <PeopleAlt className={style.icon} />
            <button onClick={handleOpenFriendModal}>
              <p className={style.actionText}>Amigos</p>
            </button>
          </div>
          <div className={style.actionInnerContainer}>
            <AddBoxOutlined className={style.icon} />
            <button>
              <p className={style.actionText}>Canjear</p>
            </button>
          </div>
          <div className={style.actionInnerContainer}>
            <PublishOutlined className={style.icon} />
            <button>
              <p className={style.actionText}>Subir una aplicación</p>
            </button>
          </div>
        </div>

        <div className={style.windowActions}>
          <button onClick={() => window.electron.minimize()}>➖</button>
          <button
            onClick={() => {
              window.electron.maximize();
              setIsMaximized(!isMaximized);
            }}
          >
            {isMaximized ? "🗗" : "🗖"}
          </button>
          <button onClick={() => window.electron.close()}>❌</button>
        </div>
        <FriendModal open={openFriendModal} onClose={handleCloseFriendModal} />
        <SettingsModal open={openSettingsModal} onClose={handleCloseSettingsModal} />
      </div>
    </div>
  );
}
