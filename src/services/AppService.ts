import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import authService from "./AuthService";
import { MINIO_IMG_PORT } from "../port/MinIoPort";

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

const getAppsByDeveloperId = async (developerId: number) => {
  try {
    const response = await axios.get(`${API_PORT}/apps/by-developer/${developerId}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getAppsByPublisherId = async (publisherId: number) => {
  try {
    const response = await axios.get(`${API_PORT}/apps/by-publisher/${publisherId}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getImageByAppId = async (appId: number) => {
  return MINIO_IMG_PORT(appId, "image");
};

const appService = {
  getApps,
  getAppById,
  getAppsByName,
  getAppsByCategoryIds,
  getAppsByUserId,
  getAppsByDeveloperId,
  getAppsByPublisherId,
  getImageByAppId,
};

export default appService;
