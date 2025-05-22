/* eslint-disable no-unused-vars */
// src/components/Modals/FriendModal/FriendModal.tsx
import { useState, useEffect, useRef } from "react";
import style from "./FriendModal.module.css";
import SearchBar from "../../SearchBar/SearchBar"; // Asegúrate que la ruta es correcta
import { Close as CloseIcon, PersonAddAlt1 as AddFriendIconMUI, Check } from "@mui/icons-material"; // Icono de añadir amigo más específico
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { UserSimple } from "../../../interfaces/User";
import InputField from "../../../components/InputField/InputField";
import authService from "../../../services/AuthService";
import { friendshipService } from "../../../services/FriendshipService";
import { Friendship, FriendshipResponseDto } from "../../../interfaces/Friendship";

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
  selectedFriend: Friendship | null;
}

const FriendRequestModal = ({ open, onClose }: FriendModalProps) => {
  const [friendName, setFriendName] = useState<string>("");

  const handleFriendNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriendName(e.target.value);
  };

  const sendFriendRequest = async () => {
    try {
      const newFriendship = await friendshipService.sendFriendRequest(
        authService.getUserId(),
        friendName
      );
      console.log(newFriendship, "Nueva amistad enviadaa");
      onClose();
    } catch (error) {
      console.error("Error enviando solicitud de amistad:", error);
    }
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
            <h2 className={`${style.titleText} ${style.textRequest}`}>
              Introduzca el nombre de usuario
            </h2>
            <InputField
              id="redeem-code"
              type="text"
              value={friendName}
              onChange={handleFriendNameChange}
              placeholder="Nombre de usuario completo.."
            />
            <div className={style.actionButtonsContainer}>
              <button
                onClick={onClose}
                className={`${style.actionRequestButton} ${style.cancelRequestButton}`}
              >
                Cancelar
              </button>
              <button
                onClick={sendFriendRequest}
                className={`${style.actionRequestButton} ${style.applyRequestButton}`}
              >
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
  const [allFriends, setAllFriends] = useState<Friendship[]>([]);
  const [friendsList, setFriendList] = useState<Friendship[]>([]);
  const [friendsPendingList, setFriendsPendingList] = useState<Friendship[]>([]);
  const [openFriendRequestModal, setOpenFriendRequestModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    visible: false,
    x: 0,
    y: 0,
    selectedFriend: null,
  });
  const username = authService.getUsername();
  const modalBoxRef = useRef<HTMLElement>(null);
  const handleOpenFriendRequestModal = () => setOpenFriendRequestModal(true);
  const handleCloseFriendRequestModal = () => setOpenFriendRequestModal(false);
  const handleSearchTerm = (term: string) => setSearchTerm(term);

  const handleFriendContextMenu = (
    event: React.MouseEvent,
    friend: UserSimple,
    friendshipId: number
  ) => {
    event.preventDefault();
    if (modalBoxRef.current) {
      const modalRect = modalBoxRef.current.getBoundingClientRect();
      setContextMenu({
        visible: true,
        x: event.clientX - modalRect.left,
        y: event.clientY - modalRect.top,
        selectedFriend: { friendshipId, user: friend },
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false, selectedFriend: null }));
  };
  const handleClickOutside = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    if (contextMenu.visible && !targetElement.closest(`.${style.contextMenu}`)) {
      handleCloseContextMenu();
    }
  };
  const handleDeleteFriendshipContext = async () => {
    if (contextMenu.selectedFriend && "friendshipId" in contextMenu.selectedFriend) {
      try {
        await friendshipService.cancelFriendship(contextMenu.selectedFriend.friendshipId);
        setAllFriends((prev) =>
          prev.filter((friend) => friend.friendshipId !== contextMenu.selectedFriend.friendshipId)
        );
        setFriendList((prev) =>
          prev.filter((friend) => friend.friendshipId !== contextMenu.selectedFriend.friendshipId)
        );
      } catch (error) {
        console.error("Error eliminando la amistad:", error);
      }
    }
    handleCloseContextMenu();
  };

  const handleDeleteFriendshipButton = async (id: number) => {
    try {
      await friendshipService.cancelFriendship(id);
      setAllFriends((prev) => prev.filter((friend) => friend.friendshipId !== id));
      setFriendList((prev) => prev.filter((friend) => friend.friendshipId !== id));
    } catch (error) {
      console.error("Error eliminando la amistad:", error);
    }
  };

  const handleAcceptFriendshipButton = async (id: number) => {
    try {
      await friendshipService.acceptFriendship(id);
      await getCurrentUserFriends();
    } catch (error) {
      console.error("Error aceptando la amistad:", error);
    }
  };

  const handleSearch = () => {
    const searchedFriends = allFriends.filter((friend) =>
      friend.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFriendList(searchedFriends);
  };

  const getCurrentUserFriends = async () => {
    const currentUserId = authService.getUserId();
    const userFriends: FriendshipResponseDto[] =
      await friendshipService.getFriendsByUserId(currentUserId);

    const acceptedFriends: FriendshipResponseDto[] = userFriends.filter(
      (friendship) => friendship.isAccepted === true
    );
    const friends: Friendship[] = acceptedFriends.map((friendship) => ({
      friendshipId: friendship.id,
      user: friendship.user1.id === currentUserId ? friendship.user2 : friendship.user1,
    }));

    setAllFriends(friends);
    setFriendList(friends);

    const pendingFriends: FriendshipResponseDto[] = userFriends.filter(
      (friendship) => friendship.isAccepted === false
    );

    const pendingFriendsList: Friendship[] = pendingFriends.map((friendship) => ({
      friendshipId: friendship.id,
      user: friendship.user1.id === currentUserId ? friendship.user2 : friendship.user1,
    }));
    setFriendsPendingList(pendingFriendsList);
  };

  const getInitials = (name: string): string => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/);
    if (words.length === 0 || words[0] === "") return "?";
    if (words.length > 1 && words[1] !== "") {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const renderTitleHeader = (title: string) => {
    return (
      <div className={style.titleHeaderContainer}>
        <div className={style.borderHorizontal}></div>
        <p className={style.titleText}>{title}</p>
        <div className={style.borderHorizontal}></div>
      </div>
    );
  };

  useEffect(() => {
    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.visible, handleCloseContextMenu]);

  useEffect(() => {
    if (!searchTerm) {
      getCurrentUserFriends();
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
              width: 80,
              height: 80,
              fontSize: "2.5rem",
              bgcolor: "var(--color-bg-secondary)",
              border: "2px solid var(--color-accent-secondary-dark)",
              ":hover": {
                boxShadow: "0 0 25px var(--color-accent-vibrant-green-shadow-hover)",
              },
            }}
          >
            {getInitials(username)}
          </Avatar>
          <Typography
            variant="h6"
            component="h2"
            id="friends-modal-title"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "var(--color-white)",
            }}
          >
            {username}
          </Typography>
        </div>
        <div className={style.searchAndAddContainer}>
          <div className={style.searchBarWrapper}>
            <SearchBar
              placeholder="Amigo1..."
              value={searchTerm}
              onSearch={handleSearch}
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
                color: "var(--color-white)",
                transition: "color 0.3s ease-in-out",
                ":hover": {
                  color: "var(--color-accent-vibrant-green-main)",
                },
              }}
            />
          </button>
        </div>
        <div className={style.friendListContainer}>
          {friendsPendingList.length > 0 && renderTitleHeader("Solicitudes de amistad")}
          <div className={`${style.friendsListColumn} ${style.friendsPending}`}>
            {friendsPendingList.length > 0 && (
              <>
                {friendsPendingList.map(({ user, friendshipId }) => (
                  <div key={user.id} className={style.friendItemStyled}>
                    <div className={`${style.avatarContainer} ${style.avatarPending}`}>
                      <Avatar
                        sx={{
                          bgcolor: "var(--color-bg-tertiary)",
                          color: "var(--color-white)",
                          width: 44,
                          height: 44,
                          fontSize: "1.3rem",
                          border: `2px solid var(--color-accent-secondary-dark)`,
                          padding: "0.4rem",
                        }}
                      >
                        {getInitials(user.username)}
                      </Avatar>
                      <Typography component="span" className={style.friendUsernameStyled}>
                        {user.username}
                      </Typography>
                      <div className={style.actionButtonsContainer}>
                        <button
                          onClick={() => handleDeleteFriendshipButton(friendshipId)}
                          className={`${style.actionButton} ${style.cancelButton}`}
                        >
                          <CloseIcon />
                        </button>
                        <button
                          onClick={() => handleAcceptFriendshipButton(friendshipId)}
                          className={`${style.actionButton} ${style.applyButton}`}
                        >
                          <Check />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          {friendsList.length > 0 && renderTitleHeader("Amigos")}
          <div className={style.friendsListColumn}>
            {friendsList.length > 0 && (
              <>
                {friendsList.map(({ user, friendshipId }) => (
                  <div
                    key={user.id}
                    className={style.friendItemStyled}
                    onContextMenu={(e) => {
                      handleFriendContextMenu(e, user, friendshipId);
                    }}
                  >
                    <div className={style.avatarContainer}>
                      <Avatar
                        sx={{
                          bgcolor: "var(--color-bg-tertiary)",
                          color: "var(--color-white)",
                          width: 44,
                          height: 44,
                          fontSize: "1.3rem",
                          border: `2px solid var(--color-border-primary)`,
                          padding: "0.4rem",
                          transition:
                            "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.3s ease-in-out",
                          ":hover": {
                            backgroundColor: "var(--color-bg-secondary)",
                            borderColor: "var(--color-accent-pastel-main)",
                            boxShadow: "0 0 10px var(--color-accent-vibrant-green-shadow-hover)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {getInitials(user.username)}
                      </Avatar>
                    </div>
                    <Typography component="span" className={style.friendUsernameStyled}>
                      {user.username}
                    </Typography>
                  </div>
                ))}
              </>
            )}
          </div>
          {friendsList.length === 0 && (
            <p className={style.noFriendsMessage}>
              {searchTerm ? "Ningun usuario coincide con su búsqueda" : "Sin amigos actualmente.."}
            </p>
          )}
        </div>
        <FriendRequestModal open={openFriendRequestModal} onClose={handleCloseFriendRequestModal} />
        {contextMenu.visible && contextMenu.selectedFriend && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            onDelete={handleDeleteFriendshipContext}
          />
        )}
      </Box>
    </Modal>
  );
};

export default FriendModal;
