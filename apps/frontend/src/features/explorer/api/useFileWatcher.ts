import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

export function useFileWatcher() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSourceUrl = `${WORKSPACE_AGENT_URL}/fs/stream`;
      
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (['add', 'unlink', 'addDir', 'unlinkDir'].includes(data.action)) {
          console.log(`File tree changed (${data.action} at ${data.path}), invalidating cache...`);
          
          queryClient.invalidateQueries({ queryKey: ['fs', 'tree'] });
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Connection lost. Browser will auto-reconnect...', error);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}