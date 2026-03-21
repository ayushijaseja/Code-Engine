import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from "@/store/workspaceStore";

async function renameNode({ oldPath, newPath, apiUrl }: { oldPath: string, newPath: string, apiUrl: string }) {
    const response = await fetch(`${apiUrl}/api/fs/rename`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ oldPath, newPath }),
    });

    if (!response.ok) throw new Error('Failed to rename');
    return response.json();
}

export function useRenameNode() {
    const queryClient = useQueryClient();
    
    const apiUrl = useWorkspaceStore((state) => state.apiUrl);

    return useMutation({
        mutationFn: (variables: { oldPath: string, newPath: string }) => {
            if (!apiUrl) throw new Error("API URL is not initialized");
            return renameNode({ ...variables, apiUrl });
        },
        onSuccess: () => {
            if (apiUrl) {
                queryClient.invalidateQueries({ 
                    queryKey: ['fs', 'tree', apiUrl] 
                });
            }
        },
    });
}