import { useRef, memo } from 'react';
import { useTerminal } from '../hooks/useTerminal';

interface TerminalPanelProps {
  id: string;
  isActive: boolean;
}

export const TerminalPanel = memo(({ id, isActive }: TerminalPanelProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useTerminal(terminalRef);

  return (
    <div
      className={`
        absolute inset-0 w-full h-full bg-[#1e1e1e] overflow-hidden flex flex-col
        ${isActive ? 'visible z-10' : 'invisible -z-10'}
      `}
      id={id}
    >
      <div ref={terminalRef} className="flex-1 overflow-hidden p-2" />
    </div>
  );
});

TerminalPanel.displayName = 'TerminalPanel';