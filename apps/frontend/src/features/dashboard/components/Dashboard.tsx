import { LaunchButton } from '@/features/dashboard/components/LaunchButton';
import { Terminal, Cpu, Database, LayoutDashboard, Settings, Trash2, Power } from 'lucide-react';
import { useLaunchWorkspace } from '@/features/dashboard/hooks/useLaunchWorkspace';
import { StopButton } from '@/features/dashboard/components/StopButton';
import { useStopWorkspace } from '@/features/dashboard/hooks/useStopWorkspace';
import { DeleteAccountButton } from '@/features/dashboard/components/DeleteAccountButton';
import { useDeleteUser } from '@/features/dashboard/hooks/useDeleteUser';

export default function Dashboard() {

    const { launch, phase: launchPhase, countdown } = useLaunchWorkspace();
    const { stop, phase: stopPhase } = useStopWorkspace();
    const { deleteAccount, phase: deletionPhase } = useDeleteUser();

    return (
        <div className="flex-1 bg-neutral-950 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-10">

                <header className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-500 font-mono text-sm tracking-widest uppercase">
                        <LayoutDashboard className="w-4 h-4" />
                        Control Plane / Infrastructure
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">
                        Workspace Overview
                    </h1>
                    <p className="text-neutral-400 max-w-2xl">
                        All data in <code className="text-blue-400">/workspace</code> is persistent across launches.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 relative group">
                        <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-cyan-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative h-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl p-8 rounded-3xl flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                        <Terminal className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <Settings className="w-5 h-5 text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">Default Environment</h3>
                                    <p className="text-sm text-neutral-500">
                                        Ubuntu 22.04 LTS • Node.js 20 • Python 3.10
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12">
                                <LaunchButton
                                    phase={launchPhase}
                                    countdown={countdown}
                                    onLaunch={launch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border border-neutral-800 bg-neutral-900/30 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 text-neutral-400">
                                <Cpu className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Resources</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-neutral-500">CPU Limit</span>
                                    <span className="text-sm font-mono text-white">0.5 Core</span>
                                </div>
                                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[50%]" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-neutral-500">Memory Limit</span>
                                    <span className="text-sm font-mono text-white">1024 MB</span>
                                </div>
                                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full w-[30%]" />
                                </div>
                            </div>
                        </div>

                        <div className="border border-neutral-800 bg-neutral-900/30 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 text-neutral-400">
                                <Database className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Persistent Storage</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-white">1.0 GB</div>
                                    <div className="text-[10px] text-neutral-500 uppercase font-bold">Standard PVC</div>
                                </div>
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-500 text-xs font-bold">
                                    Healthy
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-neutral-500" />
                        Workspace Management
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Power className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Hibernate Workspace</h3>
                                    <p className="text-xs text-neutral-500">Stop compute resources. Your files are safe.</p>
                                </div>
                            </div>
                            <StopButton phase={stopPhase} onStop={stop} />
                        </div>

                        <div className="p-6 rounded-2xl border border-red-900/20 bg-red-950/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Danger Zone</h3>
                                    <p className="text-xs text-neutral-500">Permanently delete account and ALL data.</p>
                                </div>
                            </div>
                            <DeleteAccountButton phase={deletionPhase} onDelete={deleteAccount} />
                        </div>
                    </div>
                </section>

                <footer className="pt-10 border-t border-neutral-900 flex justify-between items-center text-neutral-600 text-[11px] font-medium uppercase tracking-widest">
                    <div>Cluster: kind-control-plane</div>
                    <div>Status: All Systems Operational</div>
                </footer>
            </div>
        </div>
    );

}