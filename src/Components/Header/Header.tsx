import { NavigateBefore, NavigateNext, Replay } from "@mui/icons-material";
import style from "./Header.module.css";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username: string;
}

const Header = ({ username }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={style.container}>
      <div className={style.actionWrapper}>
        <div className={style.navigationActionsContainer}>
          <button className={style.navigationButton}>
            <Replay className={style.icon} />
          </button>
          <button className={style.navigationButton}>
            <NavigateBefore className={style.icon} />
          </button>
          <button className={style.navigationButton}>
            <NavigateNext className={style.icon} />
          </button>
          <button className={style.navigationButton} onClick={() => navigate("/home")}>
            <p className={style.navigationText}>Tienda</p>
          </button>
          <button className={style.navigationButton} onClick={() => navigate("/library")}>
            <p className={style.navigationText}>Biblioteca</p>
          </button>
        </div>
        <div className={style.userContainer}>
          <p className={style.username}>{username}</p>
          <Avatar
            sx={{
              bgcolor: "var(--bg-primary)",
              border: "2px solid var(--text-primary)",
            }}
          >
            {username.charAt(0)}
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Header;
