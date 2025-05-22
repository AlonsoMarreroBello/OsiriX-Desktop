import axios from "axios";
import { API_PORT } from "../port/ApiPort";
import authService from "./AuthService";
import { FriendshipResponseDto } from "../interfaces/Friendship";

const getFriendsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_PORT}/friendships/by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const sendFriendRequest = async (
  senderId: number,
  friendName: string
): Promise<FriendshipResponseDto> => {
  try {
    const response = await axios.post(
      `${API_PORT}/friendships?senderId=${senderId}&username=${friendName}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const acceptFriendship = async (friendshipId: number) => {
  try {
    await axios.patch(
      `${API_PORT}/friendships/${friendshipId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const cancelFriendship = async (friendshipId: number) => {
  try {
    await axios.delete(`${API_PORT}/friendships/${friendshipId}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const friendshipService = {
  getFriendsByUserId,
  acceptFriendship,
  cancelFriendship,
  sendFriendRequest,
};
