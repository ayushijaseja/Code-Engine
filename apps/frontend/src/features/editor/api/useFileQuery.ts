import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/store/workspaceStore";

export async function getFileContent(path: string, apiUrl: string): Promise<string> {
    const response = await fetch(
        `${apiUrl}/api/fs/read?path=${encodeURIComponent(path)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status}`);
    }

    const data: { content: string } = await response.json();
    return data.content;
}

export function useFileContent(path: string | null) {
    const apiUrl = useWorkspaceStore((state) => state.apiUrl);

    return useQuery({
        queryKey: ["fs", "file", path, apiUrl],

        queryFn: () => {
            if (!path) throw new Error("Path is required");
            
            if (!apiUrl) throw new Error("API URL is not initialized");

            return getFileContent(path, apiUrl);
        },

        enabled: !!path && !!apiUrl,

        staleTime: 1000 * 60 * 5,
    });
}