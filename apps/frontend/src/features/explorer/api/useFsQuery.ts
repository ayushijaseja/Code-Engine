import { useQuery } from '@tanstack/react-query';
import type { FileNode } from "@repo/shared-types"

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

async function getFileTree(){
    const response = await fetch(`${WORKSPACE_AGENT_URL}/fs/tree`);
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
}

export function useFsTree() {
  return useQuery<FileNode[]>({
    queryKey: ['fs', 'tree'],
    queryFn: getFileTree
  });
}