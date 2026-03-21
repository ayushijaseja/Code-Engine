import { Button } from '@/components/ui/button';
import { Loader2, TerminalSquare, KeyRound, Mail, AlertCircle } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthInput } from './AuthInput';

export default function AuthPage() {
  const {
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    activeMutation,
    toggleAuthMode,
    handleSubmit,
  } = useAuthForm();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-100 w-full space-y-8">
        
        {/* Branding Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-3.5 bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]">
              <TerminalSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="space-y-1.5">
             <div className="text-blue-500 font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">
                Code-Engine / Authentication
             </div>
             <h1 className="text-3xl font-extrabold tracking-tight text-white">
               {isLogin ? 'Welcome Back' : 'Initialize Account'}
             </h1>
          </div>
        </div>

        {/* Auth Card */}
        <div className="relative group">
          <div className="absolute -inset-px bg-linear-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-3xl opacity-50 transition duration-700"></div>
          
          <div className="relative p-8 border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl rounded-3xl shadow-2xl space-y-6">
            
            {/* Error State */}
            {activeMutation.isError && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{activeMutation.error?.message || "Authentication sequence failed."}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthInput
                label="Email Address"
                icon={Mail}
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
              />

              <AuthInput 
                label="Password"
                icon={KeyRound}
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={activeMutation.isPending} 
                  className="w-full h-12 text-sm font-bold rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950 bg-linear-to-r from-neutral-200 to-white hover:from-white hover:to-neutral-200 text-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4 text-neutral-500" />
                      <span className="text-neutral-500">{isLogin ? 'Authenticating...' : 'Provisioning...'}</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </div>
            </form>

            <div className="pt-2 border-t border-neutral-800/60 text-center">
              <button 
                type="button" 
                onClick={toggleAuthMode} 
                className="text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {isLogin ? "Require an environment? " : "Existing operator? "}
                <span className="text-blue-400 hover:text-blue-300 ml-1">
                  {isLogin ? "Register here" : "Sign in here"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}