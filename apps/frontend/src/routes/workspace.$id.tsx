import { BrowserPreview } from '@/features/browser-preview/components/BrowserPreview';
import { CodeEditor } from '@/features/editor/components/CodeEditor';
import { FileExplorer } from '@/features/explorer/components/FileExplorer';
import { TerminalContainer } from '@/features/terminal/components/TerminalContainer';
import { Workspace } from '@/pages/Workspace';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

type WorkspaceSearch = {
  apiUrl: string;
  wsUrl: string;
};

export const Route = createFileRoute('/workspace/$id')({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => {
    return {
      apiUrl: (search.apiUrl as string) || '',
      wsUrl: (search.wsUrl as string) || '',
    };
  },
  component: WorkspacePage,
});

function WorkspacePage() {
  const { id } = Route.useParams();

  const { apiUrl, wsUrl } = Route.useSearch();
  const setConnectionUrls = useWorkspaceStore((s) => s.setConnectionUrls);

  useEffect(() => {
    if (apiUrl && wsUrl) {
      setConnectionUrls(apiUrl, wsUrl);
    }
  }, [apiUrl, wsUrl, setConnectionUrls]);

  return (
    <Workspace
      id={id}
      explorer={<FileExplorer />}
      editor={<CodeEditor />}
      terminal={<TerminalContainer />}
      preview={<BrowserPreview />}
    />
  );
}