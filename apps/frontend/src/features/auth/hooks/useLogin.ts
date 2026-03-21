import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { loginApi, type Credentials } from '../api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: Credentials) => loginApi(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate({ to: '/dashboard' });
    },
  });
};