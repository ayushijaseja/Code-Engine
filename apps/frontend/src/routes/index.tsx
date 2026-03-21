import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { TerminalSquare } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <nav className="p-6 flex justify-between items-center border-b border-neutral-900">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-6 h-6 text-blue-500" />
          <span className="font-bold">Code-Engine</span>
        </div>
        <Link to="/auth">
          <Button variant="ghost" className="text-neutral-400 hover:text-white">Sign In</Button>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
          Compute. Persist. Develop.
        </h1>
        <p className="text-neutral-400 max-w-lg mb-10 text-lg">
          The instant-on cloud IDE powered by Kubernetes. Your environment, 
          your files, available anywhere.
        </p>
        
        <Link to="/auth">
          <Button size="lg" className="bg-white text-black hover:bg-neutral-200 h-14 px-8 text-lg font-bold rounded-2xl">
            Get Started Free
          </Button>
        </Link>
      </main>
    </div>
  );
}