import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { registerApi, type Credentials } from '../api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: Credentials) => registerApi(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate({ to: '/' });
    },
  });
};