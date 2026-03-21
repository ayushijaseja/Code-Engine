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
  terminals: string[]; 
  activeTerminal: string | null;
  apiUrl: string | null;
  wsUrl: string | null;

  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  setSelectedFolder: (path: string | null) => void;
  openFsDialog: (config: Partial<FsDialogConfig>) => void;
  closeFsDialog: () => void;
  triggerCollapseAll: () => void;
  setFocusedPath: (path: string | null) => void;
  addTerminal: () => void;
  removeTerminal: (id: string) => void;
  setActiveTerminal: (id: string) => void;
  setConnectionUrls: (apiUrl: string, wsUrl: string) => void;
}

let terminalCounter = 1;

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  openFiles: [],
  activeFile: null,
  selectedFolder: '/',
  fsDialog: { isOpen: false, type: 'file', action: 'create', targetPath: '/', initialName: '' },
  collapseSignal: 0,
  focusedPath: null,
  terminals: ['term-1'], 
  activeTerminal: 'term-1',
  apiUrl: null,
  wsUrl: null,

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

  addTerminal: () => set((state) => {
    terminalCounter++;
    const newId = `term-${terminalCounter}`;
    return { 
      terminals: [...state.terminals, newId],
      activeTerminal: newId 
    };
  }),

  removeTerminal: (id) => set((state) => {
    const newTerminals = state.terminals.filter(t => t !== id);
    let newActive = state.activeTerminal;
    
    if (state.activeTerminal === id) {
      newActive = newTerminals.length > 0 ? newTerminals[newTerminals.length - 1] : null;
    }
    
    return { terminals: newTerminals, activeTerminal: newActive };
  }),

  setActiveTerminal: (id) => set({ activeTerminal: id }),

  setConnectionUrls: (apiUrl, wsUrl) => set({ apiUrl, wsUrl }),
}));