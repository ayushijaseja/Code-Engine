import { useRef, useEffect } from 'react';
import { useSaveFile } from '../api/useSaveFile';

export function useAutoSave(activeFile: string | null) {
  const { mutate: saveFile, isPending: isSaving } = useSaveFile();
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestTextRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (typingTimerRef.current && activeFile) {
        clearTimeout(typingTimerRef.current);
        saveFile({ path: activeFile, content: latestTextRef.current });
        typingTimerRef.current = null;
      }
    };
  }, [activeFile, saveFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined || !activeFile) return;

    latestTextRef.current = value;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      saveFile({ path: activeFile, content: value });
      typingTimerRef.current = null;
    }, 5000);
  };

  return { handleEditorChange, isSaving };
}