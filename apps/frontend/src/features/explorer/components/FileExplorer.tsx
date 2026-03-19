import { FilePlus, FolderPlus, RefreshCw, ListCollapse } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useFsTree } from '../api/useFsQuery';
import { FileNode } from './FileNode';
import { useFileWatcher } from '../api/useFileWatcher';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { FsItemDialog } from './FsItemDialog'; 

export function FileExplorer() {
  useFileWatcher(); 
  const queryClient = useQueryClient();
  const { data: tree, isLoading, isError, isFetching } = useFsTree();

  const { selectedFolder, openFsDialog, triggerCollapseAll } = useWorkspaceStore();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['fs', 'tree'] });
  };

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading workspace...</div>;
  if (isError) return <div className="p-4 text-sm text-red-500">Failed to load file system.</div>;

  return (
    <div className="h-full flex flex-col bg-background border-r select-none group">
      
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="font-semibold text-xs tracking-wider text-muted-foreground uppercase">
          Explorer
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            title="New File"
            onClick={() => openFsDialog({ action: 'create', type: 'file', targetPath: selectedFolder || '/' })}
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          
          <button 
            title="New Folder"
            onClick={() => openFsDialog({ action: 'create', type: 'directory', targetPath: selectedFolder || '/' })}
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          
          <button 
            title="Refresh Explorer"
            onClick={handleRefresh}
            className={`p-1 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground ${isFetching ? 'animate-spin text-blue-400' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
            title="Collapse All"
            onClick={triggerCollapseAll}
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground"
          >
            <ListCollapse className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {tree?.map((node) => (
          <FileNode key={node.path} node={node} />
        ))}
        {tree?.length === 0 && (
          <div className="px-4 py-2 text-sm text-muted-foreground">Workspace is empty.</div>
        )}
      </div>

      <FsItemDialog />
    </div>
  );
}