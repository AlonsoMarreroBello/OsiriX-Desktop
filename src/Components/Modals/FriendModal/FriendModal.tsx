// src/components/Modals/FriendModal/FriendModal.tsx
import { useState, useEffect, useRef } from "react";
import style from "./FriendModal.module.css";
import SearchBar from "../../SearchBar/SearchBar"; // Asegúrate que la ruta es correcta
import { Close as CloseIcon, PersonAddAlt1 as AddFriendIconMUI } from "@mui/icons-material"; // Icono de añadir amigo más específico
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import User from "../../../interfaces/User";
import InputField from "../../../components/InputField/InputField";

interface FriendModalProps {
  open: boolean;
  onClose: () => void;
}
interface CustomContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  selectedFriend: User | null;
}

const exampleFriendsInitialData: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `Amigo ${i + 1}`,
}));
const exampleUserInitialData: User = {
  id: 1,
  username: "nombredeusuario",
  friends: exampleFriendsInitialData,
};

const FriendRequestModal = ({ open, onClose }: FriendModalProps) => {
  const [friendName, setFriendName] = useState<string>("");

  const handleFriendNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriendName(e.target.value);
  };

  const sendFriendRequest = () => {
    console.log("Nombre de usuario al que solicitar amistad: ", friendName);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        sx={{ zIndex: 1300 }}
      >
        <Box className={style.muiModalChildStyled}>
          <button onClick={onClose} className={style.closeButton} aria-label="Cerrar modal">
            <CloseIcon sx={{ fontSize: "2.2rem" }} />
          </button>
          <div className={style.content}>
            <h2 className={style.titleText}>Introduzca el nombre de usuario</h2>
            <InputField
              id="redeem-code"
              type="text"
              value={friendName}
              onChange={handleFriendNameChange}
              placeholder="Nombre de usuario completo.."
            />
            <div className={style.actionButtonsContainer}>
              <button onClick={onClose} className={style.actionButton}>
                Cancelar
              </button>
              <button onClick={sendFriendRequest} className={`${style.actionButton}`}>
                Aceptar
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

const ContextMenu = ({ x, y, onDelete }: CustomContextMenuProps) => {
  const handleDeleteClick = () => {
    onDelete();
  };

  return (
    <div
      className={style.contextMenu}
      style={{
        position: "absolute",
        top: y,
        left: x,
        zIndex: 1500,
      }}
    >
      <p
        onClick={handleDeleteClick}
        style={{ cursor: "pointer", margin: "0px", padding: "5px 10px" }}
      >
        Eliminar amigo
      </p>
    </div>
  );
};

const FriendModal = ({ open, onClose }: FriendModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [openFriendRequestModal, setOpenFriendRequestModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    visible: false,
    x: 0,
    y: 0,
    selectedFriend: null,
  });
  const modalBoxRef = useRef<HTMLElement>(null);
  const handleOpenFriendRequestModal = () => setOpenFriendRequestModal(true);
  const handleCloseFriendRequestModal = () => setOpenFriendRequestModal(false);
  const handleSearchTerm = (term: string) => setSearchTerm(term);

  const handleFriendContextMenu = (event: React.MouseEvent, friend: User) => {
    event.preventDefault();
    if (modalBoxRef.current) {
      const modalRect = modalBoxRef.current.getBoundingClientRect();
      setContextMenu({
        visible: true,
        x: event.clientX - modalRect.left,
        y: event.clientY - modalRect.top,
        selectedFriend: friend,
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false, selectedFriend: null }));
  };

  const handleDeleteFriend = () => {
    if (contextMenu.selectedFriend) {
      console.log("Eliminar amigo: ", contextMenu.selectedFriend.username);
      // logica para eliminar a un amigo del usuario actual......
    }
    handleCloseContextMenu();
  };

  const search = () => {
    const friendsSearched = exampleUserInitialData.friends.filter((friend) =>
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(friendsSearched);
  };

  const getCurrentUserFriends = (currentUser: User) => {
    const friends = currentUser.friends || [];
    setFilteredFriends(friends);
  };

  const getInitials = (name: string): string => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/); // Dividir por cualquier espacio y quitar espacios extra
    if (words.length === 0 || words[0] === "") return "?";
    if (words.length > 1 && words[1] !== "") {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;
      if (contextMenu.visible && !targetElement.closest(`.${style.contextMenu}`)) {
        handleCloseContextMenu(); // Esta es ahora una nueva referencia de función en cada render
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.visible, handleCloseContextMenu]);

  useEffect(() => {
    if (!searchTerm) {
      getCurrentUserFriends(exampleUserInitialData);
    }
  }, [searchTerm]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="friends-modal-title"
      aria-describedby="friends-modal-description"
      sx={{ zIndex: 1200 }}
    >
      <Box ref={modalBoxRef} className={style.muiModalBoxStyled}>
        <button onClick={onClose} className={style.closeButton} aria-label="Cerrar modal">
          <CloseIcon sx={{ fontSize: "2.2rem" }} />
        </button>
        <div className={style.header}>
          <Avatar
            sx={{
              bgcolor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              width: 80,
              height: 80,
              fontSize: "2.5rem",
              border: `3px solid var(--text-primary)`,
              marginBottom: "5px",
            }}
          >
            {getInitials(exampleUserInitialData.username)}
          </Avatar>
          <Typography
            variant="h6"
            component="h2"
            id="friends-modal-title"
            className={style.currentUsername}
          >
            {exampleUserInitialData.username}
          </Typography>
        </div>
        <div className={style.searchAndAddContainer}>
          <div className={style.searchBarWrapper}>
            <SearchBar
              placeholder="Amigo1..."
              onSearch={search}
              value={searchTerm}
              onChange={(e) => handleSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={style.addFriendButtonStyled}
            aria-label="Añadir amigo"
            onClick={handleOpenFriendRequestModal}
          >
            <AddFriendIconMUI
              sx={{
                fontSize: "2.8rem",
                color: "var(--text-alternative)",
                ":hover": { color: "var(--text-primary)" },
              }}
            />
          </button>
        </div>
        <div
          id="friends-modal-description"
          className={`${filteredFriends.length > 0 ? style.friendsListColumn : ""}`}
        >
          {filteredFriends.length > 0 ? (
            <>
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className={style.friendItemStyled}
                  onContextMenu={(e) => {
                    handleFriendContextMenu(e, friend);
                  }}
                >
                  <div className={style.avatarContainer}>
                    <Avatar
                      sx={{
                        bgcolor: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        width: 44,
                        height: 44,
                        fontSize: "1rem",
                        border: `2px solid var(--text-primary)`,
                      }}
                      className={style.friendMuiAvatarEffect}
                    >
                      {getInitials(friend.username)}
                    </Avatar>
                  </div>
                  <Typography component="span" className={style.friendUsernameStyled}>
                    {friend.username}
                  </Typography>
                </div>
              ))}
            </>
          ) : (
            <p className={style.noFriendsMessage}>No se encontraron amigos.</p>
          )}
        </div>
        <FriendRequestModal open={openFriendRequestModal} onClose={handleCloseFriendRequestModal} />
        {contextMenu.visible && contextMenu.selectedFriend && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            onDelete={handleDeleteFriend}
          />
        )}
      </Box>
    </Modal>
  );
};

export default FriendModal;
