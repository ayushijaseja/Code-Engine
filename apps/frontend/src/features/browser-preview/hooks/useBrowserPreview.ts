import { useState, useCallback } from 'react';
import { useWorkspaceStore } from "@/store/workspaceStore";

export const useBrowserPreview = (initialPort = 3000) => {
  const [activePort, setActivePort] = useState(initialPort);
  const [portInput, setPortInput] = useState(initialPort.toString());
  const [refreshKey, setRefreshKey] = useState(0);
  
  const apiUrl = useWorkspaceStore((state) => state.apiUrl);
  const previewUrl = `${apiUrl}/proxy/${activePort}/`;

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open(previewUrl, '_blank');
  }, [previewUrl]);

  const commitPortChange = useCallback(() => {
    const parsed = parseInt(portInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 65535) {
      setActivePort(parsed);
      setRefreshKey((prev) => prev + 1); 
    } else {
      setPortInput(activePort.toString());
    }
  }, [portInput, activePort]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitPortChange();
    }
  }, [commitPortChange]);

  return {
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
  };
};