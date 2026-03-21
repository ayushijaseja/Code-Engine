import { Plus, X } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { TerminalPanel } from './TerminalPanel';

export function TerminalContainer() {
  const { terminals, activeTerminal, addTerminal, removeTerminal, setActiveTerminal } = useWorkspaceStore();

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-zinc-800">
      
      <div className="flex bg-[#181818] overflow-x-auto hide-scrollbar">
        {terminals.map((id, index) => {
          const isActive = activeTerminal === id;
          return (
            <div
              key={id}
              onClick={() => setActiveTerminal(id)}
              className={`
                group flex items-center gap-2 px-4 py-1.5 text-xs border-r border-zinc-800 cursor-pointer select-none
                ${isActive ? 'bg-[#1e1e1e] text-zinc-100 border-t-2 border-t-blue-500' : 'text-zinc-500 hover:bg-[#2a2a2a] hover:text-zinc-300'}
              `}
            >
              <span>bash {index + 1}</span>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTerminal(id);
                }}
                className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-zinc-700 text-zinc-400"
              >
                <X className="w-3 h-3" />
              </div>
            </div>
          );
        })}
        
        <button 
          onClick={addTerminal}
          className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2a2a] transition-colors"
          title="New Terminal"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 relative">
        {terminals.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-600">
            No terminals open.
          </div>
        ) : (
          terminals.map((id) => (
            <TerminalPanel key={id} id={id} isActive={activeTerminal === id} />
          ))
        )}
      </div>
    </div>
  );
}