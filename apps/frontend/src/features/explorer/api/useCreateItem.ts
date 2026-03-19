import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePayload {
    path: string;
    type: 'file' | 'directory';
}

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

async function createNode(payload: CreatePayload) {
    const response = await fetch(`${WORKSPACE_AGENT_URL}/fs/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to create ${payload.type}`);
    }

    return response.json();
}

export function useCreateItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fs', 'tree'] });
        },
    });
}