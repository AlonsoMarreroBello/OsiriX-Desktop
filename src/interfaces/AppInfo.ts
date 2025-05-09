import { Category } from "./Category";
import DeveloperReseponseDto from "./Developer";
import PublisherSimpleResponseDto from "./Publisher";

export default interface AppInfo {
  appId: bigint | number | string;
  publisher: PublisherSimpleResponseDto;
  developer: DeveloperReseponseDto;
  name: string;
  version?: string;
  description?: string;
  downloads?: number;
  categories?: Category[];
  imgUrl?: string;
  isPublished: boolean;
  isVisible: boolean;
  isDownloadable: boolean;
  publicationDate: Date;
}
