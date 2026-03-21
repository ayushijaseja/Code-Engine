import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { useWorkspaceStore } from "@/store/workspaceStore";

export function useTerminal(terminalRef: React.RefObject<HTMLDivElement | null>) {
  const isInitialized = useRef(false);
  const wsUrl = useWorkspaceStore((state) => state.wsUrl);

  useEffect(() => {
    if (isInitialized.current || !terminalRef.current || !wsUrl) return;
    isInitialized.current = true;

    const term = new Terminal({
      cursorBlink: true,
      theme: { background: '#1e1e1e' },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    const socket = new WebSocket(`${wsUrl}/terminal`);

    socket.onopen = () => {
      term.write('\r\n\x1b[32m*** Connected to Ubuntu Workspace ***\x1b[0m\r\n');
      
      socket.send(JSON.stringify({
        type: 'resize',
        cols: term.cols,
        rows: term.rows
      }));
    };

    socket.onmessage = (event) => {
      term.write(event.data);
    };

    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'input', data }));
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        fitAddon.fit();
        
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'resize',
            cols: term.cols,
            rows: term.rows
          }));
        }
      }, 10);
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      term.dispose();
      isInitialized.current = false;
    };
  }, [terminalRef, wsUrl]); 
}