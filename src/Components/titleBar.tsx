import { useEffect, useState } from "react";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  useEffect(() => {
    window.electron.isMaximized(setIsMaximized);
  }, []);

  return (
    <div className="title-bar">
      <div className="title">Mi App</div>
      <div className="window-controls">
        <button onClick={() => window.electron.minimize()}>➖</button>
        <button
          onClick={() => {
            window.electron.maximize();
            setIsMaximized(!isMaximized);
          }}
        >
          {isMaximized ? "🗗" : "🗖"}
        </button>
        <button onClick={() => window.electron.close()}>❌</button>
      </div>
    </div>
  );
}
