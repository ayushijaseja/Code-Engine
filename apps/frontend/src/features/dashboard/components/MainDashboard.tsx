import { Cpu, Database, HardDrive, Server, Settings, Terminal } from "lucide-react";
import { LaunchButton } from "./LaunchButton";
import { useLaunchWorkspace } from "../hooks/useLaunchWorkspace";

export default function MainDashboard() {
    const { launch, phase: launchPhase, countdown } = useLaunchWorkspace();


    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-px bg-linear-to-br from-blue-500/20 via-cyan-500/10 to-transparent rounded-3xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative h-full border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-2xl">
                <div className="space-y-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-linear-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]">
                                <Terminal className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Standard Runtime</h3>
                                <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1 font-mono">
                                    <Server className="w-3.5 h-3.5" />
                                    ubuntu-22.04-base
                                </div>
                            </div>
                        </div>
                        <button className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-xl transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-y border-neutral-800/50 py-6">
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Node.js</p>
                            <p className="text-sm font-semibold text-neutral-200">v20.x LTS</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Python</p>
                            <p className="text-sm font-semibold text-neutral-200">3.10.12</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Docker</p>
                            <p className="text-sm font-semibold text-neutral-200">DinD Enabled</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <LaunchButton
                        phase={launchPhase}
                        countdown={countdown}
                        onLaunch={launch}
                    />
                </div>
            </div>
        </div>

        {/* Telemetry & Resources Sidebar */}
        <div className="space-y-6 flex flex-col">
            <div className="flex-1 border border-neutral-800 bg-neutral-900/40 p-6 rounded-3xl space-y-6 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-2 text-neutral-400 pb-2 border-b border-neutral-800">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">Compute Limits</span>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-neutral-400">CPU Allocation</span>
                            <span className="text-sm font-mono text-white">0.5 Core</span>
                        </div>
                        <div className="w-full bg-neutral-950 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-linear-to-r from-blue-600 to-blue-400 h-full w-[50%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-neutral-400">Memory Ceiling</span>
                            <span className="text-sm font-mono text-white">1024 MB</span>
                        </div>
                        <div className="w-full bg-neutral-950 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-linear-to-r from-cyan-600 to-cyan-400 h-full w-[30%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-900/40 p-6 rounded-3xl space-y-4 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-2 text-neutral-400 pb-2 border-b border-neutral-800">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">Volume Claims</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-800/50 rounded-xl">
                            <HardDrive className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">1.0 GB</div>
                            <div className="text-[10px] text-neutral-500 uppercase font-semibold tracking-wider">Standard PVC</div>
                        </div>
                    </div>
                    <div className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-400 text-xs font-bold tracking-wide">
                        Bound
                    </div>
                </div>
            </div>
        </div>
    </div>
}