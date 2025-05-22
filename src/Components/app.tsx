// App.tsx
import TitleBar from "./TitleBar/TitleBar";
import Header from "./Header/Header";
import HomePage from "../pages/home/HomePage";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LibraryPage from "../pages/library/LibraryPage";
import AppPage from "../pages/appPage/AppPage";
import AuthPage from "../pages/authPage/AuthPage";
import authService from "../services/AuthService";
import { useEffect, useState, useCallback } from "react";
import PublisherPage from "../pages/publisherPage/PublisherPage";
import DeveloperPage from "../pages/developerPage/DeveloperPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getToken());
  const navigate = useNavigate(); // Hook para navegar programáticamente si es necesario desde App
  const [username, setUsername] = useState<string>("Anonnymous");
  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  useEffect(() => {
    const checkAuthStatus = () => {
      const tokenExists = !!authService.getToken();
      if (isLoggedIn !== tokenExists) {
        setIsLoggedIn(tokenExists);
        if (!tokenExists) {
          navigate("/auth");
        }
      }
    };
    checkAuthStatus();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (authService.getToken()) {
      setUsername(authService.getUsername());
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    window.electron.sendLoginSuccess();
    return (
      <>
        <TitleBar />
        <Header username={username} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/app/:appId" element={<AppPage />} />
          <Route path="/publisher/:publisherId" element={<PublisherPage />} />
          <Route path="/developer/:developerId" element={<DeveloperPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  } else {
    window.electron.requestLogout();
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }
};

export default App;
