import { RefreshCw, ExternalLink, Globe, Play } from 'lucide-react';

interface PreviewToolbarProps {
  apiUrl: string;
  portInput: string;
  activePort: number;
  onPortInputChange: (value: string) => void;
  onPortCommit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onOpenExternal: () => void;
}

export const PreviewToolbar = ({
  apiUrl,
  portInput,
  activePort,
  onPortInputChange,
  onPortCommit,
  onKeyDown,
  onRefresh,
  onOpenExternal
}: PreviewToolbarProps) => {
  const isPortModified = parseInt(portInput) !== activePort && !isNaN(parseInt(portInput));

  return (
    <div className="flex items-center gap-2 p-2 bg-neutral-900 border-b border-neutral-800">
      <button 
        onClick={onRefresh}
        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition shrink-0"
        title="Refresh Preview"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      <div className="flex-1 flex items-center px-3 py-1 bg-neutral-950 rounded-md border border-neutral-800 text-sm font-mono text-neutral-300 overflow-hidden focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
        <Globe className="w-3 h-3 text-blue-500 shrink-0 mr-2" />
        
        <span className="text-neutral-500 select-none truncate">
          {apiUrl}/proxy/
        </span>
        
        <input
          type="text"
          value={portInput}
          onChange={(e) => onPortInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onPortCommit}
          className="bg-transparent text-white w-12 text-center outline-none border-b border-dashed border-neutral-600 focus:border-blue-500 mx-1"
          title="Press Enter to change port"
        />
        
        <span className="text-neutral-500 select-none">/</span>
        
        {isPortModified && (
           <button 
             onClick={onPortCommit}
             className="ml-auto text-blue-400 hover:text-blue-300 flex items-center"
             title="Connect to Port"
           >
             <Play className="w-3 h-3 fill-current" />
           </button>
        )}
      </div>

      <button 
        onClick={onOpenExternal}
        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition shrink-0"
        title="Open in New Tab"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};