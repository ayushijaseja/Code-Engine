import { LayoutDashboard } from "lucide-react";

export default function DashboardHeader() {
    return <header className="space-y-3">
        <div className="flex items-center gap-2 text-blue-500 font-mono text-xs tracking-[0.2em] uppercase font-semibold">
            <LayoutDashboard className="w-4 h-4" />
            Code-Engine / Control Plane
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                    Workspace Overview
                </h1>
                <p className="text-neutral-400 max-w-2xl text-sm md:text-base leading-relaxed">
                    Manage your containerized environments. All data mounted in <code className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20 text-sm">/workspace</code> is persistent across pod lifecycles.
                </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Cluster Connected
            </div>
        </div>
    </header>
}