export default interface AppInfo {
  id: bigint | number | string;
  name: string;
  imgUrl: string;
  description?: string;
  categories?: string[];
  releaseDate?: string | Date;
  downloads?: number;
  version?: string;
}
