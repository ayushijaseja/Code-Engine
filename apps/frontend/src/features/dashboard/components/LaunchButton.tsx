import { Button } from '@/components/ui/button';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LaunchPhase } from '../hooks/useLaunchWorkspace';

interface LaunchButtonProps {
  phase: LaunchPhase;
  countdown: number;
  onLaunch: () => void;
}

export const LaunchButton = ({ phase, countdown, onLaunch }: LaunchButtonProps) => {
  const isIdle = phase === 'idle';
  const isProvisioning = phase === 'provisioning';
  const isWarming = phase === 'warming';
  const isError = phase === 'error';

  return (
    <div className="w-full space-y-3">
      <Button
        onClick={onLaunch}
        disabled={!isIdle}
        className={cn(
          "w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950",
          isIdle && "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white hover:shadow-blue-500/25",
          (isProvisioning || isWarming) && "bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700",
          isError && "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
        )}
      >
        <div className="flex items-center justify-center gap-3">
          {isIdle && (
            <>
              <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>Initialize Workspace</span>
            </>
          )}
          
          {isProvisioning && (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <span>Provisioning Pods...</span>
            </>
          )}

          {isWarming && (
            <>
              <div className="relative flex items-center justify-center w-5 h-5 text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin opacity-40" />
                <span className="absolute text-[10px] font-mono font-bold text-white">{countdown}</span>
              </div>
              <span>Attaching Volumes...</span>
            </>
          )}

          {isError && (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>Launch Failed</span>
            </>
          )}
        </div>
      </Button>

      <p className="text-center text-xs text-neutral-500 font-medium">
        {isIdle && "Boot time is approximately 10-15 seconds via local cache"}
        {isWarming && "Finalizing ingress routing and storage..."}
        {isError && "Check cluster events via kubectl and retry"}
      </p>
    </div>
  );
};