import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export type StopPhase = 'idle' | 'stopping' | 'stopped' | 'error';

export const useStopWorkspace = () => {
  const { token } = useAuthStore();

  const [phase, setPhase] = useState<StopPhase>('idle');

  const stop = useCallback(async () => {
    if (!token || phase !== 'idle') return;

    setPhase('stopping');

    try {
      const res = await fetch('http://localhost:3000/workspaces/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Stop failed');

      const data = await res.json();
      console.log('[Stop Workspace]', data);

      setPhase('stopped');

      setTimeout(() => {
        setPhase('idle');
      }, 3000);

    } catch (error) {
      console.error('Stop Error:', error);
      setPhase('error');

      setTimeout(() => {
        setPhase('idle');
      }, 3000);
    }
  }, [token, phase]);

  return { stop, phase };
};