import Editor from '@monaco-editor/react';
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useFileContent } from '../api/useFileQuery';
import { EditorTabs } from './EditorTabs';
import { useAutoSave } from '../hooks/useAutoSave';

export function CodeEditor() {
  const activeFile = useWorkspaceStore((state) => state.activeFile);

  const { data: fileContent, isLoading, isError } = useFileContent(activeFile);
  
  const {handleEditorChange, isSaving} = useAutoSave(activeFile);

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e1e] text-muted-foreground">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Code-Engine</h2>
          <p className="text-sm">Select a file from the explorer to start coding.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] overflow-hidden relative">
      <EditorTabs />

      {isSaving && (
        <div className="absolute top-2 right-4 z-10 text-xs text-muted-foreground animate-pulse">
          Saving...
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading file...
        </div>
      )}
      
      {isError && (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Failed to load file content.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            path={activeFile}
            value={fileContent || ''}
            onChange={handleEditorChange} 
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 },
            }}
          />
        </div>
      )}
    </div>
  );
}