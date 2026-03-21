import { useState, useRef } from 'react';
import { RefreshCw, ExternalLink, Globe, Play, Power } from 'lucide-react';
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

export const BrowserPreview = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  
  const [activePort, setActivePort] = useState(3000);
  const [portInput, setPortInput] = useState('3000');
  const [key, setKey] = useState(0); 
  
  const apiUrl = useWorkspaceStore((state) => state.apiUrl);
  const previewUrl = `${apiUrl}/proxy/${activePort}/`;

  const toggleConnection = () => {
    setIsConnected((prev) => {
      const nextState = !prev;
      if (nextState) setKey((k) => k + 1);
      return nextState;
    });
  };

  const handleRefresh = () => {
    if (!isConnected) {
      setIsConnected(true);
    }
    setKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(previewUrl, '_blank');
  };

  const commitPortChange = () => {
    const parsed = parseInt(portInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 65535) {
      setActivePort(parsed);
      setIsConnected(true); 
      setKey((prev) => prev + 1); 
    } else {
      setPortInput(activePort.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitPortChange();
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 border-l border-neutral-800">
      <div className="flex items-center gap-2 p-2 bg-neutral-900 border-b border-neutral-800">
        
        <button 
          onClick={toggleConnection}
          className={cn(
            "p-1.5 rounded-md transition shrink-0 border",
            isConnected 
              ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" 
              : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
          )}
          title={isConnected ? "Stop Preview" : "Start Preview"}
        >
          <Power className="w-4 h-4" />
        </button>

        <button 
          onClick={handleRefresh}
          disabled={!isConnected}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition shrink-0 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Refresh Preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className={cn(
          "flex-1 flex items-center px-3 py-1 rounded-md border border-neutral-800 text-sm font-mono transition-all overflow-hidden",
          isConnected ? "bg-neutral-950 text-neutral-300 focus-within:border-blue-500/50" : "bg-neutral-900 text-neutral-600"
        )}>
          <Globe className={cn("w-3 h-3 shrink-0 mr-2", isConnected ? "text-blue-500" : "text-neutral-600")} />
          
          <span className="select-none truncate">
            {apiUrl}/proxy/
          </span>
          
          <input
            type="text"
            value={portInput}
            onChange={(e) => setPortInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitPortChange}
            disabled={!isConnected && portInput === activePort.toString()} 
            className="bg-transparent text-current w-12 text-center outline-none border-b border-dashed border-neutral-700 focus:border-blue-500 mx-1 disabled:border-transparent"
            title="Press Enter to change port"
          />
          
          <span className="select-none">/</span>
          
          {parseInt(portInput) !== activePort && (
             <button 
               onClick={commitPortChange}
               className="ml-auto text-blue-400 hover:text-blue-300 flex items-center"
               title="Connect to Port"
             >
               <Play className="w-3 h-3 fill-current" />
             </button>
          )}
        </div>

        <button 
          onClick={handleOpenExternal}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition shrink-0"
          title="Open in New Tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 bg-white relative flex items-center justify-center">
        {isConnected ? (
          <iframe
            key={key}
            ref={iframeRef}
            src={previewUrl}
            className="absolute inset-0 w-full h-full border-none bg-white"
            title="Workspace Preview"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            allow="clipboard-read; clipboard-write; microphone; camera"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-400 space-y-4">
            <Globe className="w-16 h-16 opacity-20" />
            <div className="text-center">
              <p className="font-medium text-neutral-600">Preview is Offline</p>
              <p className="text-sm mt-1">Start your server and connect to view it here.</p>
            </div>
            <button 
              onClick={toggleConnection}
              className="px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition shadow-sm"
            >
              Connect to Port {activePort}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};