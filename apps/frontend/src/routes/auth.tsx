import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, TerminalSquare, KeyRound, Mail } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useRegister } from '@/features/auth/hooks/useRegister';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const activeMutation = isLogin ? loginMutation : registerMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    activeMutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-6 font-sans">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <TerminalSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter bg-linear-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-cyan-600 rounded-2xl blur opacity-20 transition duration-1000"></div>
          
          <div className="relative p-8 border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-2xl space-y-6">
            
            {activeMutation.isError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                {activeMutation.error?.message || "An error occurred"}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={activeMutation.isPending} 
                className="w-full h-12 mt-2 bg-white text-black hover:bg-neutral-200 font-bold rounded-xl"
              >
                {activeMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? 'Sign In' : 'Register')}
              </Button>
            </form>

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); activeMutation.reset(); }} 
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}