import { useState } from 'react';

export function useClipboard(timeout = 2000) {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [text]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [text]: false }));
    }, timeout);
  };

  const copied = (text: string) => copiedMap[text];

  return { copy, copied };
}
