import { create } from 'zustand';

interface FsDialogConfig {
  isOpen: boolean;
  type: 'file' | 'directory';
  action: 'create' | 'rename';
  targetPath: string;
  initialName: string;
}

interface WorkspaceState {
  openFiles: string[];
  activeFile: string | null;
  selectedFolder: string | null;
  fsDialog: FsDialogConfig;
  collapseSignal: number;
  focusedPath: string | null;
  
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  setSelectedFolder: (path: string | null) => void;
  openFsDialog: (config: Partial<FsDialogConfig>) => void;
  closeFsDialog: () => void;
  triggerCollapseAll: () => void;
  setFocusedPath: (path: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  openFiles: [],
  activeFile: null,
  selectedFolder: '/',
  fsDialog: { isOpen: false, type: 'file', action: 'create', targetPath: '/', initialName: '' },
  collapseSignal: 0,
  focusedPath: null,

  openFile: (path) => set((state) => {
    if (state.openFiles.includes(path)) {
      return { activeFile: path };
    }

    return {
      openFiles: [...state.openFiles, path],
      activeFile: path,
    };
  }),

  closeFile: (path) => set((state) => {
    const newOpenFiles = state.openFiles.filter((file) => file !== path);
    let newActiveFile = state.activeFile;

    if (state.activeFile === path) {
      newActiveFile = newOpenFiles.length > 0
        ? newOpenFiles[newOpenFiles.length - 1]
        : null;
    }

    return {
      openFiles: newOpenFiles,
      activeFile: newActiveFile,
    };
  }),

  setActiveFile: (path) => set({ activeFile: path }),

  setSelectedFolder: (path) => set({ selectedFolder: path }),

  openFsDialog: (config) => set((state) => ({ fsDialog: { ...state.fsDialog, ...config, isOpen: true } })),

  closeFsDialog: () => set((state) => ({ fsDialog: { ...state.fsDialog, isOpen: false } })),

  triggerCollapseAll: () => set((state) => ({ collapseSignal: state.collapseSignal + 1 })),

  setFocusedPath: (path) => set({ focusedPath: path }),
}));