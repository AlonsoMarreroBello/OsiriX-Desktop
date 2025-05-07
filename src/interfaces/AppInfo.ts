export default interface AppInfo {
  id: bigint | number | string;
  name: string;
  version?: string;
  description?: string;
  downloads?: number;
  categories?: string[];
  releaseDate?: string | Date;
  imgUrl?: string;
}

export interface FriendUser {
  id: string | number;
  username: string;
  avatarUrl?: string; // URL a la imagen del avatar
  initials?: string; // O iniciales si no hay avatarUrl
}

export interface AppData {
  id: string | number;
  name: string;
  imageUrl: string; // URL de la imagen principal de la app
  publisher: string;
  developer: string;
  releaseDate: string; // O podrías usar Date y formatearla
  downloads: number;
  currentVersion: string;
  description: string;
  friendsWhoHaveApp: FriendUser[];
  downloadLink?: string; // Opcional, para el botón de descarga
}
