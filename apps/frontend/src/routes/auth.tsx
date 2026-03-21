import Auth from '@/features/auth/components/Auth';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage(){
  return <Auth />
}