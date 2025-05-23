import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import { Category } from "../interfaces/Category";
import authService from "./AuthService";

const getCategories = async () => {
  try {
    const response = await axios.get(`${API_PORT}/categories`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const categoryService = {
  getCategories,
};

export default categoryService;
