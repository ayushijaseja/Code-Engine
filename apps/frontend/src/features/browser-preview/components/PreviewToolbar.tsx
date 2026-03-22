import { RefreshCw, ExternalLink, Globe, Play } from 'lucide-react';

interface PreviewToolbarProps {
  apiUrl: string;
  routeInput: string;
  activeRoute: string;
  onRouteInputChange: (value: string) => void;
  onRouteCommit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onOpenExternal: () => void;
}

export const PreviewToolbar = ({
  apiUrl,
  routeInput,
  activeRoute,
  onRouteInputChange,
  onRouteCommit,
  onKeyDown,
  onRefresh,
  onOpenExternal
}: PreviewToolbarProps) => {
  const isRouteModified = routeInput !== activeRoute;

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
          value={routeInput}
          onChange={(e) => onRouteInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onRouteCommit}
          className="bg-transparent text-white flex-1 min-w-25 outline-none border-b border-dashed border-neutral-600 focus:border-blue-500 mx-1"
          title="Press Enter to navigate"
        />
        
        {isRouteModified && (
           <button 
             onMouseDown={(e) => {
               e.preventDefault(); 
               onRouteCommit();
             }}
             className="ml-auto text-blue-400 hover:text-blue-300 flex items-center shrink-0"
             title="Go to Route"
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