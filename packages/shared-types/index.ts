export interface Workspace {
  id: string;
  podStatus: 'Pending' | 'Running';
  ingressUrl: string;
}

export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    extension?: string;
    isHidden: boolean;
    size?: number;
    children?: FileNode[];
}