import { Button } from '@/components/ui/button';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeletePhase } from '../hooks/useDeleteUser';

interface DeleteAccountButtonProps {
  phase: DeletePhase;
  onDelete: () => void;
}

export const DeleteAccountButton = ({ phase, onDelete }: DeleteAccountButtonProps) => {
  const isIdle = phase === 'idle';
  const isDeleting = phase === 'deleting' || phase === 'deleted';
  const isError = phase === 'error';

  return (
    <div className="w-full space-y-3 mt-auto">
      <Button
        onClick={onDelete}
        disabled={!isIdle}
        variant="destructive"
        className={cn(
          "w-full h-12 text-sm font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2 focus:ring-offset-neutral-900",
          isIdle && "bg-red-950/20 text-red-500 border border-red-900/30 hover:bg-red-950/40 hover:border-red-800/50 hover:text-red-400",
          isDeleting && "bg-neutral-900/50 text-neutral-600 border border-neutral-800 cursor-not-allowed shadow-none",
          isError && "bg-red-950/60 text-red-400 border border-red-900/80"
        )}
      >
        <div className="flex items-center justify-center gap-2.5">
          {isIdle && (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Wipe Data & Delete Account</span>
            </>
          )}

          {isDeleting && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Purging Resources...</span>
            </>
          )}

          {isError && (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>Deletion Sequence Failed</span>
            </>
          )}
        </div>
      </Button>

      <div className="h-4 flex items-center justify-center">
        <p className="text-center text-[11px] text-red-400/60 font-medium uppercase tracking-wider">
          {isIdle && "This action cannot be undone"}
          {isDeleting && "Removing k8s namespaces and volumes..."}
          {isError && "Manual cleanup intervention required"}
        </p>
      </div>
    </div>
  );
};