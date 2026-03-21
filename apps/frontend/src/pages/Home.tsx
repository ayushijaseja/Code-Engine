import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { 
  TerminalSquare, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  HardDrive, 
  Server,
  Code2,
  BarChart3,
  Users,
  Clock,
  Cpu
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-cyan-500/20 overflow-x-hidden">
      
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <TerminalSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold tracking-tight text-white text-base">Code-Engine</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/auth" className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">
              Operator Login
            </Link>
            <Link to="/auth">
              <Button className="h-9 px-4 text-xs font-bold rounded-lg bg-white text-black hover:bg-gray-100 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Live v2.0
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white text-balance leading-tight">
              Your Code. 
              <br />
              <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Instantly Deployed.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto text-balance leading-relaxed">
              Enterprise-grade cloud IDE with sub-second boot times, persistent storage, and strict container isolation. Start coding in seconds, not minutes.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black h-12 px-8 text-base font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 group">
                Initialize Free Tier
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-bold rounded-xl border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-800 backdrop-blur-sm transition-all text-neutral-200">
                <Code2 className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              value="500ms"
              label="Average Boot Time"
              icon={Clock}
            />
            <StatCard 
              value="99.9%"
              label="Infrastructure Uptime"
              icon={BarChart3}
            />
            <StatCard 
              value="256GB"
              label="Persistent Storage"
              icon={HardDrive}
            />
            <StatCard 
              value="12+"
              label="Language Support"
              icon={Code2}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Built for Developers
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Everything you need for modern cloud development, from environment to deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Large Feature Card */}
            <FeatureCardLarge 
              icon={Zap}
              title="Sub-Second Boot Times"
              description="Warm container pooling ensures your Node.js, Python, Rust, or Go environments are ready the moment you authenticate. No cold starts."
            />
            <FeatureCardLarge 
              icon={ShieldCheck}
              title="Enterprise Security"
              description="Dedicated namespaces with non-root security contexts. Zero-trust isolation. Encrypted storage. Your code stays locked down."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              icon={HardDrive}
              title="Persistent Volumes"
              description="Your database, files, and state survive pod lifecycles with automatic PVC binding."
            />
            <FeatureCard 
              icon={Users}
              title="Team Collaboration"
              description="Share workspaces and code. Real-time collaboration with granular access control."
            />
            <FeatureCard 
              icon={Cpu}
              title="Auto Scaling"
              description="Automatic resource allocation. Pay only for what you use with predictable pricing."
            />
            <FeatureCard 
              icon={Server}
              title="Multi-Region Deploy"
              description="Deploy to any region globally with one click. Automatic failover and load balancing."
            />
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-24 px-6 bg-neutral-950/50 border-t border-neutral-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Performance That Scales
            </h2>
            <p className="text-lg text-neutral-400">
              Built on Kubernetes. Designed for speed.
            </p>
          </div>

          <div className="bg-linear-to-b from-neutral-900 to-neutral-950 border border-neutral-800/50 rounded-2xl p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PerformanceItem title="Instant Activation" metric="0.2s" />
              <PerformanceItem title="Code Compilation" metric="1.5s" />
              <PerformanceItem title="Database Sync" metric="200ms" />
              <PerformanceItem title="Global Latency" metric="< 50ms" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Start Building Today
            </h2>
            <p className="text-lg text-neutral-400">
              Join thousands of developers using Code-Engine for instant cloud development.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black h-12 px-8 text-base font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-bold rounded-xl border-neutral-800 bg-transparent hover:bg-neutral-900 backdrop-blur-sm transition-all">
                View Documentation
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-900/50 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Code-Engine
          </div>
          <div>© {new Date().getFullYear()} Engine Infrastructure. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group relative p-6 rounded-xl bg-neutral-950/50 border border-neutral-800/50 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm flex flex-col space-y-4 hover:shadow-lg hover:shadow-cyan-500/10">
      <div className="p-3 bg-neutral-900 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed mt-2">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureCardLarge({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group relative p-8 rounded-2xl bg-linear-to-br from-neutral-900/80 to-neutral-950 border border-neutral-800/50 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm flex flex-col space-y-6 hover:shadow-xl hover:shadow-cyan-500/10">
      <div className="p-4 bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-base text-neutral-400 leading-relaxed mt-3">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({ value, label, icon: Icon }: { value: string, label: string, icon: any }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-3">
      <div className="p-2 bg-cyan-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-black text-white">{value}</p>
        <p className="text-xs md:text-sm text-neutral-400 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function PerformanceItem({ title, metric }: { title: string, metric: string }) {
  return (
    <div className="flex items-end justify-between pb-4 border-b border-neutral-800/50">
      <span className="text-neutral-300 font-medium">{title}</span>
      <span className="text-2xl font-black text-cyan-400">{metric}</span>
    </div>
  );
}
