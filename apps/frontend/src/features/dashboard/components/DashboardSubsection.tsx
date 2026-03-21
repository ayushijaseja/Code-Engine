import { Power, Settings, Trash2 } from "lucide-react";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { StopButton } from "./StopButton";
import { useStopWorkspace } from "../hooks/useStopWorkspace";
import { useDeleteUser } from "../hooks/useDeleteUser";

export default function DashboardSubseaction() {
    const { stop, phase: stopPhase } = useStopWorkspace();
    const { deleteAccount, phase: deletionPhase } = useDeleteUser();

    return <section className="pt-6 border-t border-neutral-800/60 space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-neutral-500" />
                Lifecycle Management
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-3xl border border-neutral-800 bg-neutral-900/40 space-y-6 hover:bg-neutral-900/60 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                        <Power className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Hibernate Environment</h3>
                        <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                            Scale compute pods down to zero. Your persistent volume and configurations remain fully intact.
                        </p>
                    </div>
                </div>
                <StopButton phase={stopPhase} onStop={stop} />
            </div>

            <div className="p-6 md:p-8 rounded-3xl border border-red-900/30 bg-red-950/10 space-y-6 hover:bg-red-950/20 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-red-400">Destructive Actions</h3>
                        <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                            Permanently delete all associated resources, including your database rows, secrets, and volume claims.
                        </p>
                    </div>
                </div>
                <DeleteAccountButton phase={deletionPhase} onDelete={deleteAccount} />
            </div>
        </div>
    </section>
}