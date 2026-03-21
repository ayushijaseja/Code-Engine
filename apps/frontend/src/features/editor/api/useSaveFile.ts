import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from "@/store/workspaceStore";

interface SavePayload {
  path: string;
  content: string;
}

async function saveFile({ path, content }: SavePayload, apiUrl: string) {
  const response = await fetch(`${apiUrl}/api/fs/write`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, content }),
  });

  if (!response.ok) {
    throw new Error('Failed to save file');
  }

  return response.json();
}

export function useSaveFile() {
  const queryClient = useQueryClient();
  
  const apiUrl = useWorkspaceStore((state) => state.apiUrl);

  return useMutation({
    mutationFn: (payload: SavePayload) => {
      if (!apiUrl) throw new Error("API URL is not initialized");
      return saveFile(payload, apiUrl);
    },
    onSuccess: (_, variables) => {
      if (apiUrl) {
        queryClient.setQueryData(
            ['fs', 'file', variables.path, apiUrl], 
            variables.content
        );
      }
    },
  });
}