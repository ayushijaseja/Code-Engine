import { Button } from '@/components/ui/button';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LaunchPhase } from '../hooks/useLaunchWorkspace';

interface LaunchButtonProps {
  phase: S;
  countdown: number;
  onLaunch: () => void;
}

export const LaunchButton = ({ phase, countdown, onLaunch }: LaunchButtonProps) => {
  const isIdle = phase === 'idle';
  const isProvisioning = phase === 'provisioning';
  const isWarming = phase === 'warming';
  const isError = phase === 'error';

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={onLaunch}
        disabled={!isIdle}
        className={cn(
          "w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg",
          isIdle && "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20",
          (isProvisioning || isWarming) && "bg-neutral-800 text-neutral-400 cursor-not-allowed",
          isError && "bg-red-500/20 text-red-400 border border-red-500/50"
        )}
      >
        <div className="flex items-center gap-3">
          {isIdle && (
            <>
              <Rocket className="w-6 h-6 animate-pulse" />
              <span>Launch New Workspace</span>
            </>
          )}
          
          {isProvisioning && (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Contacting Cluster...</span>
            </>
          )}

          {isWarming && (
            <>
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin opacity-20" />
                <span className="absolute text-[10px] font-mono">{countdown}s</span>
              </div>
              <span>Warming Up Container...</span>
            </>
          )}

          {isError && (
            <>
              <AlertCircle className="w-6 h-6" />
              <span>Provisioning Failed</span>
            </>
          )}
        </div>
      </Button>

      <p className="text-center text-xs font-medium text-neutral-500">
        {isIdle && "Estimated setup time: ~10 seconds"}
        {isWarming && "Almost there! Attaching persistent storage..."}
        {isError && "Please check your K8s cluster status and try again."}
      </p>
    </div>
  );
};