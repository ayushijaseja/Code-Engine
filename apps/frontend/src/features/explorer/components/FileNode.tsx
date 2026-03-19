import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, FolderOpen, Trash2, Edit2, FilePlus, FolderPlus } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useDeleteNode } from '../api/useDeleteNode';
import type { FileNode as FileNodeType } from "@repo/shared-types"

interface FileNodeProps {
  node: FileNodeType;
  depth?: number;
}

export function FileNode({ node, depth = 0 }: FileNodeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { openFile, activeFile, focusedPath, setFocusedPath, setSelectedFolder, closeFile, openFsDialog, collapseSignal } = useWorkspaceStore();
  const { mutate: deleteNode } = useDeleteNode();

  const isDirectory = node.type === 'directory';
  const isActive = activeFile === node.path;
  const isFocused = focusedPath === node.path;

  useEffect(() => {
    if (collapseSignal > 0 && isDirectory) {
      setIsOpen(false);
    }
  }, [collapseSignal, isDirectory]);

  const handleClick = () => {
    setFocusedPath(node.path);
    if (isDirectory) {
      setIsOpen(!isOpen);
      setSelectedFolder(node.path);
    } else {
      openFile(node.path);
      const parentDir = node.path.substring(0, node.path.lastIndexOf('/')) || '/';
      setSelectedFolder(parentDir);
    }
  };

  const handleRightClick = () => {
    if (isDirectory) {
      setSelectedFolder(node.path);
    } else {
      const parentDir = node.path.substring(0, node.path.lastIndexOf('/')) || '/';
      setSelectedFolder(parentDir);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${node.name}?`)) {
      deleteNode(node.path);
      if (!isDirectory && isActive) {
        closeFile(node.path);
      }
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={handleRightClick}>
        <div
          onClick={handleClick}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`
            flex items-center py-1 px-2 cursor-pointer text-sm select-none
            hover:bg-accent hover:text-accent-foreground transition-colors group
            ${isFocused ? 'bg-accent/50 text-accent-foreground font-medium' : ''}
          `}
        >
          <span className="w-4 h-4 mr-1 flex items-center justify-center">
            {isDirectory && (isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
          </span>

          <span className="mr-2 text-muted-foreground/80">
            {isDirectory ? (
              isOpen ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />
            ) : (
              <File className="w-4 h-4" />
            )}
          </span>

          <span className="truncate">{node.name}</span>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48 bg-[#1e1e1e] border-zinc-800 text-zinc-300">
        <ContextMenuItem
          onClick={() => openFsDialog({ action: 'create', type: 'file', targetPath: isDirectory ? node.path : node.path.substring(0, node.path.lastIndexOf('/')) || '/' })}
          className="gap-2 cursor-pointer focus:bg-zinc-800"
        >
          <FilePlus className="w-4 h-4" /> New File
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => openFsDialog({ action: 'create', type: 'directory', targetPath: isDirectory ? node.path : node.path.substring(0, node.path.lastIndexOf('/')) || '/' })}
          className="gap-2 cursor-pointer focus:bg-zinc-800"
        >
          <FolderPlus className="w-4 h-4" /> New Folder
        </ContextMenuItem>

        <ContextMenuSeparator className="bg-zinc-800" />

        <ContextMenuItem
          onClick={() => openFsDialog({ action: 'rename', type: isDirectory ? 'directory' : 'file', targetPath: node.path, initialName: node.name })}
          className="gap-2 cursor-pointer focus:bg-zinc-800"
        >
          <Edit2 className="w-4 h-4" /> Rename
        </ContextMenuItem>

        <ContextMenuSeparator className="bg-zinc-800" />

        <ContextMenuItem
          onClick={handleDelete}
          className="gap-2 cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-500"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>

      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </ContextMenu>
  );
}