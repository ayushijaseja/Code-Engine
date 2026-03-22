import { useState, useCallback } from 'react';
import { useWorkspaceStore } from "@/store/workspaceStore";

export const useBrowserPreview = (initialPort = 3000) => {
  const [activeRoute, setActiveRoute] = useState(`${initialPort}/`);
  const [routeInput, setRouteInput] = useState(`${initialPort}/`);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const apiUrl = useWorkspaceStore((state) => state.apiUrl);
  
  const cleanRoute = activeRoute.startsWith('/') ? activeRoute.slice(1) : activeRoute;
  const previewUrl = `${apiUrl}/proxy/${cleanRoute}`;

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open(previewUrl, '_blank');
  }, [previewUrl]);

  const commitRouteChange = useCallback(() => {
    const match = routeInput.match(/^(\d+)(.*)/);
    
    if (match) {
      const parsedPort = parseInt(match[1], 10);
      let path = match[2] || '/';
      
      if (path && !path.startsWith('/')) {
        path = `/${path}`;
      }

      if (parsedPort > 0 && parsedPort <= 65535) {
        const newRoute = `${parsedPort}${path}`;
        setActiveRoute(newRoute);
        setRouteInput(newRoute);
        setRefreshKey((prev) => prev + 1); 
        return;
      }
    }
    
    setRouteInput(activeRoute);
  }, [routeInput, activeRoute]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitRouteChange();
    }
  }, [commitRouteChange]);

  return {
    apiUrl,
    previewUrl,
    activeRoute,
    routeInput,
    refreshKey,
    setRouteInput,
    handleRefresh,
    handleOpenExternal,
    commitRouteChange,
    handleKeyDown,
  };
};