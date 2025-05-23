/* eslint-disable no-unused-vars */
import { Search } from "@mui/icons-material";
import style from "./SearchBar.module.css";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  onSearch?: () => void; // quitar el ? despues
}

const SearchBar = ({ placeholder, onSearch, ...props }: SearchBarProps) => {
  return (
    <div className={style.searchBarContainer}>
      <button className={style.searchIcon} onClick={() => onSearch()}>
        <Search />
      </button>
      <input type="text" className={style.input} placeholder={placeholder || ""} {...props} />
      <button className={style.searchButton} onClick={() => onSearch()}>
        Buscar
      </button>
    </div>
  );
};

export default SearchBar;
