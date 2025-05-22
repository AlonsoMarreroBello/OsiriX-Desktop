import { UserSimple } from "./User";

export interface FriendshipResponseDto {
  id: number;
  user1: UserSimple;
  user2: UserSimple;
  friendshipDate: Date;
  isAccepted: boolean;
}

export interface Friendship {
  friendshipId: number;
  user: UserSimple;
}
