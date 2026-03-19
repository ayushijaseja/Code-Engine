import { CodeEditor } from '@/features/editor/components/CodeEditor';
import { FileExplorer } from '@/features/explorer/components/FileExplorer';
import { TerminalPanel } from '@/features/terminal/components/TerminalPanel';
import { Workspace } from '@/pages/Workspace';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/workspace/$id')({
  component: WorkspacePage,
});

function WorkspacePage() {
  const { id } = Route.useParams();

  return (
    <Workspace
      id={id}
      explorer={<FileExplorer />} 
      editor={<CodeEditor />}
      terminal={<TerminalPanel />}
    />
  );
}