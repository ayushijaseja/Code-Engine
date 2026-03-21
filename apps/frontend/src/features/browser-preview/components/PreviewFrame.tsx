import { useRef } from 'react';

interface PreviewFrameProps {
  url: string;
  refreshKey: number;
}

export const PreviewFrame = ({ url, refreshKey }: PreviewFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex-1 bg-white relative">
      <iframe
        key={refreshKey}
        ref={iframeRef}
        src={url}
        className="absolute inset-0 w-full h-full border-none bg-white"
        title="Workspace Preview"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        allow="clipboard-read; clipboard-write; microphone; camera"
      />
    </div>
  );
};