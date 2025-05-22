import { useEffect, useState } from "react";
import style from "./TitleBar.module.css";
import logo from "../../assets/osirix.png";
import { AddBoxOutlined, PeopleAlt, PublishOutlined, Settings } from "@mui/icons-material";
import FriendModal from "../Modals/FriendModal/FriendModal";
import SettingsModal from "../Modals/SettingsModal/SettingsModal";
import RedeemModal from "../Modals/RedeemModal/RedeemModal";
import { useNavigate } from "react-router-dom";
import { WEB_PUBLISHER_REQUEST } from "../../port/WebPort";
export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [openFriendModal, setOpenFriendModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openRedeemModal, setOpenRedeemModal] = useState(false);
  const navigate = useNavigate();

  const handleOpenFriendModal = () => setOpenFriendModal(true);
  const handleCloseFriendModal = () => setOpenFriendModal(false);
  const handleOpenSettingsModal = () => setOpenSettingsModal(true);
  const handleCloseSettingsModal = () => setOpenSettingsModal(false);
  const handleOpenRedeemModal = () => setOpenRedeemModal(true);
  const handleCloseRedeemModal = () => setOpenRedeemModal(false);
  useEffect(() => {
    window.electron.isMaximized(setIsMaximized);
  }, []);
  const handleNavigator = () => {
    window.electron.openExternal(WEB_PUBLISHER_REQUEST);
  };
  return (
    <div className={style.titleBar}>
      <div className={style.actionsContainer}>
        <div className={style.linkActions}>
          <div className={style.actionInnerContainer}>
            <img src={logo} alt="logo" className={style.logo} />
            <p className={style.actionText}>Osirix</p>
          </div>
          {/* <div className={style.actionInnerContainer}>
            <Settings className={style.icon} />
            <button onClick={handleOpenSettingsModal}>
              <p className={style.actionText}>Ajustes</p>
            </button>
          </div> */}
          <div className={style.actionInnerContainer}>
            <PeopleAlt className={style.icon} />
            <button onClick={handleOpenFriendModal}>
              <p className={style.actionText}>Amigos</p>
            </button>
          </div>
          <div className={style.actionInnerContainer}>
            <AddBoxOutlined className={style.icon} />
            <button onClick={handleOpenRedeemModal}>
              <p className={style.actionText}>Canjear</p>
            </button>
          </div>
          <div className={style.actionInnerContainer}>
            <PublishOutlined className={style.icon} />
            <button>
              <a onClick={handleNavigator} className={style.actionText}>
                Subir una aplicación
              </a>
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
        <RedeemModal open={openRedeemModal} onClose={handleCloseRedeemModal} />
      </div>
    </div>
  );
}
