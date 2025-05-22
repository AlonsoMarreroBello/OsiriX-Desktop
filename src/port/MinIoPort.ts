export const MINIO_IMG_PORT = (appId: number, imgFileName: string) =>
  `http://localhost:9000/app-repo/${appId}/media/${imgFileName}.jpg`;
