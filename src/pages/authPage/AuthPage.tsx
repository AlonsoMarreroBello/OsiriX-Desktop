import { useEffect, useState } from "react";
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
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
  });
  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const navigate = useNavigate();
  const handleCheckedPassword = (password: string) => {
    setCheckPassword(password);
  };

  const handleWantsToRegister = () => {
    setWantsToRegister(!wantsToRegister);
  };

  const handleEmail = (e: string) => {
    setUser((prev) => ({ ...prev, email: e }));
  };
  const handleUsername = (e: string) => {
    setUser((prev) => ({ ...prev, username: e }));
  };
  const handlePassword = (e: string) => {
    setUser((prev) => ({ ...prev, password: e }));
  };
  const passChecked = user.password == checkPassword ? true : false;

  const handleAuth = async () => {
    try {
      if (wantsToRegister) {
        console.log(user, "register");
        await authService.register(user);
      } else {
        console.log(user, "log");
        await authService.login({ ...user, origin: "DESKTOP" });
      }
      if (authService.getToken()) {
        onLoginSuccess();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(passChecked);
  }, [checkPassword]);

  return (
    <div className={styles.container}>
      {/* Panel Izquierdo */}
      <div className={styles.leftPanel}>
        <img src={logoUrl} alt="Osirix Logo" className={styles.logo} />
        <p className={styles.quote}>Frase de ejemplo</p>
      </div>

      {!wantsToRegister ? (
        <>
          <div className={styles.rightPanel}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Inicio de Sesión</h1>
              <form onSubmit={handleAuth} className={styles.form}>
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
                <a href="#" className={styles.forgotPassword}>
                  ¿Has olvidado la contraseña?
                </a>
                <Button type="submit" variant="contained" className={styles.loginButton}>
                  Iniciar Sesión
                </Button>
              </form>
              <p className={styles.registerLink}>
                ¿No tienes una cuenta aún?{" "}
                <a href="#" onClick={handleWantsToRegister}>
                  ¡Regístrate aquí!
                </a>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.rightPanel}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Registro</h1>
              <form onSubmit={handleAuth} className={styles.form}>
                <InputField
                  id="username"
                  label="Nombre de usuario"
                  type="text"
                  value={user.username}
                  onChange={(e) => handleUsername(e.target.value)}
                  required
                />
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
                <InputField
                  id="password"
                  label="Confirmar contraseña"
                  type="password"
                  value={checkPassword}
                  onChange={(e) => handleCheckedPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  className={styles.loginButton}
                  disabled={!passChecked}
                >
                  Registrarse
                </Button>
              </form>
              <p className={styles.registerLink}>
                ¿Ya tienes una cuenta?{" "}
                <a href="#" onClick={handleWantsToRegister}>
                  Inicia sesión aquí!
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default AuthPage;
