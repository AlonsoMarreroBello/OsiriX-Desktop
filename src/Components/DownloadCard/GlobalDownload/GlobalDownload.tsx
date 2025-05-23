import { useDownload } from "../../../context/DownloadContext";
import DownloadProgress from "../DownloadProgress";

const GlobalDownload = () => {
  const { isDownloading, progress, appName } = useDownload();

  if (!isDownloading) return null;

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <DownloadProgress appName={appName} progress={progress} currentIndex={0} totalItems={1} />
    </div>
  );
};

export default GlobalDownload;
