import { Book, Logout, Shop } from "@mui/icons-material";
import style from "./Header.module.css";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";

interface HeaderProps {
  username: string;
}

const Header = ({ username }: HeaderProps) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    authService.clearToken();
    navigate("/auth");
  };
  return (
    <div className={style.container}>
      <div className={style.actionWrapper}>
        <div className={style.navigationActionsContainer}>
          <button className={style.navigationButton} onClick={() => navigate("/home")}>
            <Shop className={style.icon} />
            <p className={style.navigationText}>Tienda</p>
          </button>
          <button className={style.navigationButton} onClick={() => navigate("/library")}>
            <Book className={style.icon} />

            <p className={style.navigationText}>Biblioteca</p>
          </button>
        </div>
        <div className={style.userContainer}>
          <p className={style.username}>{username}</p>
          <Avatar
            sx={{
              bgcolor: "var(--color-bg-secondary)",
              border: "2px solid var(--color-accent-secondary-dark)",
              ":hover": {
                boxShadow: "0 0 15px var(--color-accent-vibrant-green-shadow-hover)",
              },
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <button className={style.navigationButton} onClick={() => handleLogout()}>
            <Logout className={style.icon} />
            <p className={style.navigationText}>Salir</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
