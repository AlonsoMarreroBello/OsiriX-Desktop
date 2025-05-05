import { NavigateBefore, NavigateNext, Replay } from "@mui/icons-material";
import style from "./Header.module.css"

interface HeaderProps {
    username: string;
}

const Header = ({ username }: HeaderProps) => {
    return (
        <div className={style.container}>
            <div className={style.actionWrapper}>
                <div className={style.navigationActionsContainer}>
                    <Replay className={style.icon} />
                    <NavigateBefore className={style.icon} />
                    <NavigateNext className={style.icon} />
                    <button className={style.navigationButton}><p className={style.navigationText}>Tienda</p></button>
                    <button className={style.navigationButton}><p className={style.navigationText}>Biblioteca</p></button>
                </div>
                <div className={style.userContainer}>
                    <p className={style.username}>{username}</p>
                    <button className={style.userAvatar}>{username.charAt(0).toUpperCase()}</button>
                </div>
            </div>
        </div>
    )
}

export default Header