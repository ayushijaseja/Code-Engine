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
  const isDeleting = phase === 'deleting';
  const isError = phase === 'error';

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={onDelete}
        disabled={!isIdle}
        className={cn(
          "w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg",
          isIdle && "bg-red-900 hover:bg-red-800 text-white shadow-red-500/30",
          isDeleting && "bg-neutral-800 text-neutral-400 cursor-not-allowed",
          isError && "bg-red-500/20 text-red-400 border border-red-500/50"
        )}
      >
        <div className="flex items-center gap-3">
          {isIdle && (
            <>
              <Trash2 className="w-6 h-6" />
              <span>Delete Account</span>
            </>
          )}

          {isDeleting && (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Deleting Everything...</span>
            </>
          )}

          {isError && (
            <>
              <AlertTriangle className="w-6 h-6" />
              <span>Deletion Failed</span>
            </>
          )}
        </div>
      </Button>

      <p className="text-center text-xs font-medium text-neutral-500">
        {isIdle && "This will permanently delete your account and all associated resources."}
        {isDeleting && "Removing Kubernetes resources and user data..."}
        {isError && "Something went wrong. Please try again or contact support."}
      </p>
    </div>
  );
};