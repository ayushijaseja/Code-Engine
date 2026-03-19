import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useRenameNode } from '../api/useRename';
import { useCreateItem } from '../api/useCreateItem';

export function FsItemDialog() {
  const { fsDialog, closeFsDialog } = useWorkspaceStore();
  const [name, setName] = useState('');
  
  const { mutate: createItem, isPending: isCreating } = useCreateItem();
  const { mutate: renameNode, isPending: isRenaming } = useRenameNode();

  useEffect(() => {
    if (fsDialog.isOpen) {
      setName(fsDialog.initialName);
    }
  }, [fsDialog.isOpen, fsDialog.initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === fsDialog.initialName) return;

    if (fsDialog.action === 'create') {
      const targetPath = fsDialog.targetPath === '/' ? `/${name}` : `${fsDialog.targetPath}/${name}`;
      createItem({ path: targetPath, type: fsDialog.type }, { onSuccess: closeFsDialog });
    } 
    else if (fsDialog.action === 'rename') {
      const parentDir = fsDialog.targetPath.substring(0, fsDialog.targetPath.lastIndexOf('/')) || '/';
      const newPath = parentDir === '/' ? `/${name}` : `${parentDir}/${name}`;
      renameNode({ oldPath: fsDialog.targetPath, newPath }, { onSuccess: closeFsDialog });
    }
  };

  const isPending = isCreating || isRenaming;

  return (
    <Dialog open={fsDialog.isOpen} onOpenChange={closeFsDialog}>
      <DialogContent className="bg-[#1e1e1e] text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>
            {fsDialog.action === 'create' ? 'Create New' : 'Rename'} {fsDialog.type === 'file' ? 'File' : 'Folder'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">
              {fsDialog.action === 'create' ? 'Location:' : 'Target:'} <span className="font-mono text-blue-400">{fsDialog.targetPath}</span>
            </span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-700 focus-visible:ring-blue-500"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={closeFsDialog} className="hover:bg-zinc-800">Cancel</Button>
            <Button type="submit" disabled={isPending || !name.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}