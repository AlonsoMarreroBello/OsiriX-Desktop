import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import authService from "./AuthService";

const getApps = async () => {
  try {
    const response = await axios.get(`${API_PORT}/apps`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getAppById = async (appId: number) => {
  try {
    const response = await axios.get(`${API_PORT}/apps/${appId}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getAppsByName = async (appName: string) => {
  try {
    const response = await axios.get(`${API_PORT}/apps/search?name=${appName}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getAppsByCategoryIds = async (categoryIds: number[]) => {
  try {
    const response = await axios.get(`${API_PORT}/apps/by-categories?categoryIds=${categoryIds}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getAppsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_PORT}/apps/by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const appService = {
  getApps,
  getAppById,
  getAppsByName,
  getAppsByCategoryIds,
  getAppsByUserId,
};

export default appService;
