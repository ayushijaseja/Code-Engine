import { useQuery } from "@tanstack/react-query";

const WORKSPACE_AGENT_URL = import.meta.env.VITE_WORKSPACE_AGENT_URL;

export async function getFileContent(path: string): Promise<string> {
    const response = await fetch(
        `${WORKSPACE_AGENT_URL}/fs/read?path=${encodeURIComponent(path)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status}`);
    }

    const data: { content: string } = await response.json();
    return data.content;
}

export function useFileContent(path: string | null) {
    return useQuery({
        queryKey: ["fs", "file", path],

        queryFn: () => {
            if (!path) throw new Error("Path is required");
            return getFileContent(path);
        },

        enabled: !!path,

        staleTime: 1000 * 60 * 5,
    });
}