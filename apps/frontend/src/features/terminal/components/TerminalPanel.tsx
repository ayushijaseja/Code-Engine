import { useRef } from 'react';
import { useTerminal } from '../hooks/useTerminal';

export function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useTerminal(terminalRef);

  return (
    <div className="h-full w-full bg-[#1e1e1e] p-2 overflow-hidden flex flex-col">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 select-none flex justify-between">
        <span>Terminal</span>
        <span className="text-green-500/70 lowercase">bash</span>
      </div>
      
      <div ref={terminalRef} className="flex-1 overflow-hidden" />
    </div>
  );
}