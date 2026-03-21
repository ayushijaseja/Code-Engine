import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from "@/store/workspaceStore";

async function deleteNode(path: string, apiUrl: string) {
    const response = await fetch(`${apiUrl}/api/fs/delete?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete file/folder');
    }

    return response.json();
}

export function useDeleteNode() {
    const queryClient = useQueryClient();
    
    const apiUrl = useWorkspaceStore((state) => state.apiUrl);

    return useMutation({
        mutationFn: (path: string) => {
            if (!apiUrl) throw new Error("API URL is not initialized");
            return deleteNode(path, apiUrl);
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