import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from "@/store/workspaceStore";

interface CreatePayload {
    path: string;
    type: 'file' | 'directory';
}

async function createNode(payload: CreatePayload, apiUrl: string) {
    const response = await fetch(`${apiUrl}/api/fs/create`, {
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
    
    const apiUrl = useWorkspaceStore((state) => state.apiUrl);

    return useMutation({
        mutationFn: (payload: CreatePayload) => {
            if (!apiUrl) throw new Error("API URL is not initialized");
            return createNode(payload, apiUrl);
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