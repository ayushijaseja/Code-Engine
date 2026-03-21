import { X } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspaceStore';

export function EditorTabs() {
  const { openFiles, activeFile, setActiveFile, closeFile } = useWorkspaceStore();

  if (openFiles.length === 0) return null;

  return (
    <div className="flex bg-background border-b hide-scrollbar">
      {openFiles.map((filePath) => {
        const fileName = filePath.split('/').pop() || filePath;
        const isActive = activeFile === filePath;

        return (
          <div
            key={filePath}
            onClick={() => setActiveFile(filePath)}
            className={`
              group flex items-center gap-2 px-3 py-2 text-sm border-r cursor-pointer select-none
              ${isActive ? 'bg-accent text-accent-foreground border-t-2 border-t-blue-500' : 'text-muted-foreground hover:bg-muted'}
            `}
          >
            <span>{fileName}</span>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                closeFile(filePath);
              }}
              className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 text-muted-foreground"
            >
              <X className="w-3 h-3" />
            </div>
          </div>
        );
      })}
    </div>
  );
}