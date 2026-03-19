import { useMutation, useQueryClient } from '@tanstack/react-query';

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

async function renameNode({ oldPath, newPath }: { oldPath: string, newPath: string }) {
    const response = await fetch(`${WORKSPACE_AGENT_URL}/fs/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
    });

    if (!response.ok) throw new Error('Failed to rename');
    return response.json();
}

export function useRenameNode() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: renameNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fs', 'tree'] });
        },
    });
}