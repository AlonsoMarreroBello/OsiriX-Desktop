import { Search } from "@mui/icons-material";
import style from "./SearchBar.module.css";
const SearchBar = () => {
  return (
    <div className={style.searchBarContainer}>
      <button className={style.searchIcon}>
        <Search />
      </button>
      <input type="text" className={style.input} placeholder="Buscar aplicaciones" />
      <button className={style.searchButton}>Buscar</button>
    </div>
  );
};

export default SearchBar;
