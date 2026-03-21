import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';

interface WorkspaceLayoutProps {
  explorer: React.ReactNode;
  editor: React.ReactNode;
  terminal: React.ReactNode;
  preview: React.ReactNode;
  id: string;
}

export function Workspace({ explorer, editor, terminal, preview, id }: WorkspaceLayoutProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <header className="h-10 border-b flex items-center px-4 bg-muted/40 justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight text-primary">CODE-ENGINE</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs font-medium text-muted-foreground">ws-{id}</span>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal"> 
          
          <ResizablePanel defaultSize={20} minSize={15}>
            {explorer}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup orientation="vertical">
              
              <ResizablePanel defaultSize={70} minSize={20}>
                {editor}
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={30} minSize={15}>
                  <ResizablePanelGroup orientation="horizontal">
                    
                    <ResizablePanel defaultSize={60} minSize={30}>
                      {terminal}
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle />
                    
                    <ResizablePanel defaultSize={40} minSize={20}>
                      {preview}
                    </ResizablePanel>
                    
                  </ResizablePanelGroup>
                  {terminal}
              </ResizablePanel>

            </ResizablePanelGroup>
          </ResizablePanel>

        </ResizablePanelGroup>
      </main>
    </div>
  );
}