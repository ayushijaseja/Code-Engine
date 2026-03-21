import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';

export type LaunchPhase = 'idle' | 'provisioning' | 'warming' | 'ready' | 'error';

export const useLaunchWorkspace = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [phase, setPhase] = useState<LaunchPhase>('idle');
  const [countdown, setCountdown] = useState(5);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const launch = useCallback(async () => {
    if (!token || phase !== 'idle') return;

    setPhase('provisioning');

    try {
      const res = await fetch('http://localhost:3000/workspaces/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Provisioning failed');

      const data = await res.json();
      
      const { podName, apiUrl, wsUrl } = data.details;

      setPhase('warming');
      setCountdown(5); 

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }

            setPhase('ready');

            setTimeout(() => {
              navigate({
                to: '/workspace/$id',
                params: { id: String(podName) }, 
                search: {
                  apiUrl: String(apiUrl),
                  wsUrl: String(wsUrl)
                }
              });
            }, 0);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Launch Error:", error);
      setPhase('error');
      setTimeout(() => setPhase('idle'), 3000);
    }
  }, [token, phase, navigate]);

  return { launch, phase, countdown };
};