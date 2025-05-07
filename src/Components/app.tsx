import TitleBar from "./TitleBar/TitleBar";
import Header from "./Header/Header";
import HomePage from "../pages/home/HomePage";
import { Route, Routes } from "react-router-dom";
import LibraryPage from "../pages/library/LibraryPage";
import AppPage from "../pages/appPage/AppPage";

const App = () => {
  // implementar luego la comprobación si el usuario está logueado o no, en base al token almacenado en el localStorage
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>
      <TitleBar />
      <Header username="TuPrima" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/app/:appId" element={<AppPage />} /> {/* Si usas IDs dinámicos */}
        <Route path="/app-details" element={<AppPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
