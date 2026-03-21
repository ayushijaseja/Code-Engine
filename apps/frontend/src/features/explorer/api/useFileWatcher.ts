import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from "@/store/workspaceStore";

export function useFileWatcher() {
  const queryClient = useQueryClient();
  
  const apiUrl = useWorkspaceStore((state) => state.apiUrl);

  useEffect(() => {
    if (!apiUrl) return;

    const eventSourceUrl = `${apiUrl}/api/fs/stream`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (['add', 'unlink', 'addDir', 'unlinkDir'].includes(data.action)) {
          console.log(`File tree changed (${data.action} at ${data.path}) for ${apiUrl}`);
          
          queryClient.invalidateQueries({ queryKey: ['fs', 'tree', apiUrl] });
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Connection lost to', apiUrl, error);
    };

    return () => {
      console.log('Closing SSE connection to', apiUrl);
      eventSource.close();
    };
  }, [queryClient, apiUrl]); 
}