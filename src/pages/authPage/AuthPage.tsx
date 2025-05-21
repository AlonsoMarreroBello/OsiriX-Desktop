import { FormEvent, useEffect, useState } from "react";
import InputField from "../../components/InputField/InputField";
import styles from "./AuthPage.module.css";
import { Button } from "@mui/material";
import authService from "../../services/AuthService";
import User from "../../interfaces/User";
import { useNavigate } from "react-router-dom";
import logoUrl from "../../assets/osirix.png";

interface AuthPageProps {
  onLoginSuccess?: () => void;
}

const AuthPage = ({ onLoginSuccess }: AuthPageProps) => {
  const [user, setUser] = useState<User>({ username: "", email: "", password: "" });
  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");

  const navigate = useNavigate();

  const handleCheckedPassword = (password: string) => setCheckPassword(password);
  const handleEmail = (e: string) => setUser((prev) => ({ ...prev, email: e }));
  const handleUsername = (e: string) => setUser((prev) => ({ ...prev, username: e }));
  const handlePassword = (e: string) => setUser((prev) => ({ ...prev, password: e }));
  const passChecked = user.password === checkPassword;

  const handleWantsToRegister = () => {
    setWantsToRegister((prev) => {
      const next = !prev;
      setTimeout(() => setActiveForm(next ? "register" : "login"), 300);
      return next;
    });
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (wantsToRegister) {
        await authService.register(user);
      } else {
        await authService.login({ ...user, origin: "DESKTOP" });
      }
      if (authService.getToken()) {
        onLoginSuccess?.();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(passChecked);
  }, [checkPassword]);

  const authButtonSx = {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "1rem",
    backgroundColor: "var(--color-accent-vibrant-green-main)",
    color: "var(--color-text-on-accent-vibrant)",
    borderRadius: "var(--border-radius-medium)",
    textTransform: "none",
    border: "none",
    boxShadow: "none",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      backgroundColor: "var(--color-accent-vibrant-green-dark)",
      boxShadow: "0 4px 15px var(--color-accent-vibrant-green-shadow-hover)",
    },
    "&.Mui-disabled": {
      backgroundColor: "var(--color-bg-input)",
      color: "var(--color-text-tertiary)",
      cursor: "not-allowed",
      boxShadow: "none",
    },
  };

  const renderInputFields = () => {
    return (
      <>
        {activeForm === "register" && (
          <InputField
            id="username"
            label="Nombre de usuario"
            type="text"
            value={user.username}
            onChange={(e) => handleUsername(e.target.value)}
            required
          />
        )}
        {activeForm && (
          <>
            <InputField
              id="email"
              label="Correo electrónico"
              type="email"
              value={user.email}
              onChange={(e) => handleEmail(e.target.value)}
              required
            />
            <InputField
              id="password"
              label="Contraseña"
              type="password"
              value={user.password}
              onChange={(e) => handlePassword(e.target.value)}
              required
            />
          </>
        )}
        {activeForm === "register" && (
          <InputField
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            value={checkPassword}
            onChange={(e) => handleCheckedPassword(e.target.value)}
            required
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.leftPanel} ${wantsToRegister ? styles.leftPanelShifted : ""}`}>
        <img src={logoUrl} alt="Osirix Logo" className={styles.logo} />
        <p className={styles.quote}>Tu software, a otro nivel.</p>
      </div>

      <div className={`${styles.rightPanel} ${wantsToRegister ? styles.rightPanelShifted : ""}`}>
        <div
          className={`${styles.formWrapper} ${
            activeForm === "login" ? styles.loginForm : styles.registerForm
          }`}
        >
          <div className={styles.formContainer}>
            <h1 className={styles.title}>
              {activeForm === "login" ? "Inicio de Sesión" : "Registrarse"}
            </h1>
            <form onSubmit={handleAuth} className={styles.form}>
              {renderInputFields()}
              {activeForm === "login" && (
                <a href="#" className={styles.forgotPassword}>
                  ¿Has olvidado la contraseña?
                </a>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={authButtonSx}
                disabled={activeForm === "register" && !passChecked}
              >
                {activeForm === "register" ? "Registrarse" : "Iniciar Sesión"}
              </Button>
            </form>
            <p className={styles.toggleLink}>
              {activeForm === "register" ? (
                <>
                  ¿Ya tienes una cuenta? <a onClick={handleWantsToRegister}>Inicia sesión aquí</a>
                </>
              ) : (
                <>
                  ¿No tienes una cuenta aún?{" "}
                  <a onClick={handleWantsToRegister}>¡Regístrate aquí!</a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
