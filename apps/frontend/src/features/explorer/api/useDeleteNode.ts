import { useMutation, useQueryClient } from '@tanstack/react-query';

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

async function deleteNode(path: string) {
    const response = await fetch(`${WORKSPACE_AGENT_URL}/fs/delete?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete file/folder');
    }

    return response.json();
}

export function useDeleteNode() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fs', 'tree'] });
        },
    });
}