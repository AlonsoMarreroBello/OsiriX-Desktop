import { ImgType } from "../models/ImgModel";

export const MINIO_IMG_PORT = (appId: number, imgFileName: ImgType) =>
  `http://localhost:9000/app-repo/${appId}/media/${imgFileName}.jpg`;
