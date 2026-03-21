import { Button } from '@/components/ui/button';
import { Square, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StopPhase } from '../hooks/useStopWorkspace';
import { useEffect } from 'react';

interface StopButtonProps {
  phase: StopPhase;
  onStop: () => void;
}

export const StopButton = ({ phase, onStop }: StopButtonProps) => {
  const isIdle = phase === 'idle';
  const isStopping = phase === 'stopping' || phase === 'stopped';
  const isError = phase === 'error';

  console.log(phase);

  useEffect(()=>{
    console.log(phase);
  },[phase]);

  return (
    <div className="w-full space-y-3 mt-auto">
      <Button
        onClick={onStop}
        disabled={!isIdle}
        className={cn(
          "w-full h-12 text-sm font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-900 focus:ring-offset-2 focus:ring-offset-neutral-900",
          isIdle && "bg-orange-950/20 text-orange-500 border border-orange-900/30 hover:bg-orange-950/40 hover:border-orange-800/50 hover:text-orange-400",
          isStopping && "bg-neutral-900/50 text-neutral-600 border border-neutral-800 cursor-not-allowed shadow-none",
          isError && "bg-red-950/60 text-red-400 border border-red-900/80"
        )}
      >
        <div className="flex items-center justify-center gap-2.5">
          {isIdle && (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Execute Hibernation</span>
            </>
          )}

          {isStopping && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
              <span>Terminating Pods...</span>
            </>
          )}

          {isError && (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Graceful Stop Failed</span>
            </>
          )}
        </div>
      </Button>

      <div className="h-4 flex items-center justify-center">
        <p className="text-center text-xs text-neutral-500 font-medium">
          {isStopping && "Draining connections and releasing compute..."}
          {isError && "Forced termination may be required"}
        </p>
      </div>
    </div>
  );
};