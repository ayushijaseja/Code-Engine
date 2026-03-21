import { Button } from '@/components/ui/button';
import { Square, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StopPhase } from '../hooks/useStopWorkspace';

interface StopButtonProps {
  phase: StopPhase;
  onStop: () => void;
}

export const StopButton = ({ phase, onStop }: StopButtonProps) => {
  const isIdle = phase === 'idle';
  const isStopping = phase === 'stopping';
  const isError = phase === 'error';

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={onStop}
        disabled={!isIdle}
        className={cn(
          "w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg",
          isIdle && "bg-red-900 hover:bg-red-800 text-white shadow-red-500/20",
          isStopping && "bg-neutral-800 text-neutral-400 cursor-not-allowed",
          isError && "bg-red-500/20 text-red-400 border border-red-500/50"
        )}
      >
        <div className="flex items-center gap-3">
          {isIdle && (
            <>
              <Square className="w-6 h-6" />
              <span>Stop Workspace</span>
            </>
          )}

          {isStopping && (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Releasing Resources...</span>
            </>
          )}

          {isError && (
            <>
              <AlertCircle className="w-6 h-6" />
              <span>Stop Failed</span>
            </>
          )}
        </div>
      </Button>

      <p className="text-center text-xs font-medium text-neutral-500">
        {isIdle && "This will stop compute resources but preserve your storage."}
        {isStopping && "Shutting down pods and freeing cluster resources..."}
        {isError && "Something went wrong. Check logs or retry."}
      </p>
    </div>
  );
};