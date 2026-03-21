import { useAuthStore } from '@/store/useAuthStore';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';
import { LogOut, TerminalSquare } from 'lucide-react';

export const Route = createFileRoute('/_protected')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth' });
  };

  return ( 
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TerminalSquare className="w-6 h-6 text-blue-500" />
          <span className="font-bold tracking-tight">Code-Engine</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-medium text-neutral-400">
            {user?.email}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}