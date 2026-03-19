import { useMutation, useQueryClient } from '@tanstack/react-query';

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

interface SavePayload {
  path: string;
  content: string;
}

async function saveFile({path, content} : SavePayload){
      const response = await fetch(`${WORKSPACE_AGENT_URL}/fs/write`, {
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

  return useMutation({
    mutationFn: saveFile ,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['fs', 'file', variables.path], variables.content);
    },
  });
}