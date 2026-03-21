import { useBrowserPreview } from "../hooks/useBrowserPreview";
import { PreviewFrame } from "./PreviewFrame";
import { PreviewToolbar } from "./PreviewToolbar";

export const BrowserPreview = () => {
  const {
    apiUrl,
    previewUrl,
    activePort,
    portInput,
    refreshKey,
    setPortInput,
    handleRefresh,
    handleOpenExternal,
    commitPortChange,
    handleKeyDown,
  } = useBrowserPreview();

  return (
    <div className="flex flex-col h-full bg-white border-l border-neutral-800">
      <PreviewToolbar
        apiUrl={apiUrl!}
        portInput={portInput}
        activePort={activePort}
        onPortInputChange={setPortInput}
        onPortCommit={commitPortChange}
        onKeyDown={handleKeyDown}
        onRefresh={handleRefresh}
        onOpenExternal={handleOpenExternal}
      />
      
      <PreviewFrame
        url={previewUrl}
        refreshKey={refreshKey}
      />
    </div>
  );
};