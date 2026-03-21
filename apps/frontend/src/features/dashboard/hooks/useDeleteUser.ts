import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';

export type DeletePhase = 'idle' | 'deleting' | 'deleted' | 'error';

export const useDeleteUser = () => {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<DeletePhase>('idle');

  const deleteAccount = useCallback(async () => {
    if (!token || phase !== 'idle') return;

    const confirmDelete = window.confirm(
      "This will permanently delete your account and ALL data. This action cannot be undone. Continue?"
    );

    if (!confirmDelete) return;

    setPhase('deleting');

    try {
      const res = await fetch('http://localhost:3000/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      const data = await res.json();
      console.log('[Delete Account]', data);

      setPhase('deleted');

      logout?.();

      setTimeout(() => {
        navigate({ to: '/' });
      }, 1000);

    } catch (error) {
      console.error('Delete Error:', error);
      setPhase('error');

      setTimeout(() => {
        setPhase('idle');
      }, 3000);
    }
  }, [token, phase, navigate, logout]);

  return { deleteAccount, phase };
};