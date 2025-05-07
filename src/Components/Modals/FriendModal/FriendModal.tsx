// src/components/Modals/FriendModal/FriendModal.tsx
import React, { useState, useEffect } from "react";
import style from "./FriendModal.module.css";
import SearchBar from "../../SearchBar/SearchBar"; // Asegúrate que la ruta es correcta
import { Close as CloseIcon, PersonAddAlt1 as AddFriendIconMUI } from "@mui/icons-material"; // Icono de añadir amigo más específico
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import User from "../../../interfaces/User";

interface FriendModalProps {
  open: boolean;
  onClose: () => void;
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

export const FriendModal = ({ open, onClose }: FriendModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);

  const handleSearchTerm = (term: string) => setSearchTerm(term);
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
      <Box className={style.muiModalBoxStyled}>
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
          <button className={style.addFriendButtonStyled} aria-label="Añadir amigo">
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
                <div key={friend.id} className={style.friendItemStyled}>
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
      </Box>
    </Modal>
  );
};

export default FriendModal;
