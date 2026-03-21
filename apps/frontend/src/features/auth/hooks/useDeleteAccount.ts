import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { deleteAccountApi } from '../api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('Not authenticated');
      return deleteAccountApi(token);
    },
    onSuccess: () => {
      logout();
      navigate({ to: '/auth' });
    },
  });
};