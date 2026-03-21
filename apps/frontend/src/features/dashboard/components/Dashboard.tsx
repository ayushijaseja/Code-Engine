import { Activity, ShieldCheck, Globe } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import MainDashboard from './MainDashboard';
import DashboardFooter from './DashboardFooter';
import DashboardSubseaction from './DashboardSubsection';

export default function Dashboard() {

    return (
        <div className="flex-1 bg-[#0a0a0a] min-h-screen p-6 md:p-10 overflow-y-auto font-sans selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto space-y-12">

                <DashboardHeader />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-neutral-900/60 transition-colors">
                        <div className="p-3 bg-neutral-800/50 rounded-xl text-neutral-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Network Ingress</p>
                            <p className="text-lg font-semibold text-white">Traefik Active</p>
                        </div>
                    </div>
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-neutral-900/60 transition-colors">
                        <div className="p-3 bg-neutral-800/50 rounded-xl text-neutral-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Security Context</p>
                            <p className="text-lg font-semibold text-white">Non-Root Strict</p>
                        </div>
                    </div>
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-neutral-900/60 transition-colors">
                        <div className="p-3 bg-neutral-800/50 rounded-xl text-neutral-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Region</p>
                            <p className="text-lg font-semibold text-white">Local (Kind)</p>
                        </div>
                    </div>
                </div>

                <MainDashboard />

                <DashboardSubseaction />

                <DashboardFooter />
            </div>
        </div>
    );
}