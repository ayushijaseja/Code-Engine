import { Clock, Server } from "lucide-react";

export default function DashboardFooter() {
    return <footer className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 text-xs font-medium uppercase tracking-widest">
        <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5" />
            Target: kind-control-plane
        </div>
        <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            System Uptime: 99.99%
        </div>
    </footer>
}