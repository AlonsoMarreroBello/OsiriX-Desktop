import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import { AuthLoginRequestDto, AuthRegisterRequestDto, DecodedToken } from "../interfaces/Auth";
import { jwtDecode } from "jwt-decode";

const login = async (credentials: AuthLoginRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/login`, credentials);
    localStorage.setItem("token", response.data.data.token);
  } catch (error) {
    console.error(error);
  }
};

const register = async (credentials: AuthRegisterRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/register`, credentials);
    console.log(response);
    localStorage.setItem("token", response.data.data.token);
  } catch (error) {
    console.error(error);
  }
};

const getToken = () => localStorage.getItem("token");

const clearToken = () => localStorage.removeItem("token");

const getUsernameFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    console.log(tokenData);
    return tokenData.sub;
  }
};

const getUserIdFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    console.log(tokenData, "service userId");
    return tokenData.userId;
  }
};

const authService = {
  login,
  register,
  getToken,
  clearToken,
  getUsernameFromToken,
  getUserIdFromToken,
};
export default authService;
