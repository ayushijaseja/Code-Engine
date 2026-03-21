import { useQuery } from '@tanstack/react-query';
import type { FileNode } from "@repo/shared-types";
import { useWorkspaceStore } from "@/store/workspaceStore";

async function getFileTree(apiUrl: string): Promise<FileNode[]> {
    const response = await fetch(`${apiUrl}/api/fs/tree`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export function useFsTree() {
  const apiUrl = useWorkspaceStore((state) => state.apiUrl);

  return useQuery<FileNode[]>({
    queryKey: ['fs', 'tree', apiUrl],
    queryFn: () => {
        if (!apiUrl) throw new Error("API URL is not initialized");
        return getFileTree(apiUrl);
    },
    enabled: !!apiUrl
  });
}