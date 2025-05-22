import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import { AuthLoginRequestDto, AuthRegisterRequestDto, DecodedToken } from "../interfaces/Auth";
import { jwtDecode } from "jwt-decode";

const login = async (credentials: AuthLoginRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/login`, credentials);
    const token = response.data.data.token;
    if (token) {
      setUserInfoToLocalStorage(token);
    }
  } catch (error) {
    console.error(error);
  }
};

const register = async (credentials: AuthRegisterRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/register`, credentials);
    const token = response.data.data.token;
    if (token) {
      setUserInfoToLocalStorage(token);
    }
  } catch (error) {
    console.error(error);
  }
};

const getToken = () => localStorage.getItem("token");

const clearToken = () => clearAuthDataFromLocalStorage();

const getUsername = () => {
  return localStorage.getItem("username");
};

const getUserId = () => {
  const userIdStr = localStorage.getItem("userId");
  return userIdStr ? parseInt(userIdStr, 10) : null;
};

const setUserInfoToLocalStorage = (token: string) => {
  try {
    const decodedData: DecodedToken = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("username", decodedData.sub);
    localStorage.setItem("userId", decodedData.userId.toString());
    console.log("User info set to localStorage:", decodedData);
  } catch (error) {
    console.error("Error decoding token or setting user info to localStorage:", error);
    clearAuthDataFromLocalStorage(); // Limpia si hay error
  }
};
const clearAuthDataFromLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  // localStorage.removeItem("userInfo");
  console.log("Auth data cleared from localStorage");
};

const authService = {
  login,
  register,
  getToken,
  clearToken,
  getUsername,
  getUserId,
};
export default authService;
