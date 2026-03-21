import { useState } from 'react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useRegister } from '@/features/auth/hooks/useRegister';

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const activeMutation = isLogin ? loginMutation : registerMutation;

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    activeMutation.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    activeMutation.mutate({ email, password });
  };

  return {
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    activeMutation,
    toggleAuthMode,
    handleSubmit,
  };
};