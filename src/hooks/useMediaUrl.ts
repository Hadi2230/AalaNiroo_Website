import { useEffect, useState } from 'react';
import { idbGetBlob } from '@/utils/idb';

export function useMediaUrl(inputUrl?: string) {
  // Start undefined to avoid trying to load unsupported schemes like idb: before resolution
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    (async () => {
      if (!inputUrl) {
        setResolvedUrl(undefined);
        return;
      }
      if (inputUrl.startsWith('idb:')) {
        const key = inputUrl.slice(4);
        try {
          const blob = await idbGetBlob(key);
          if (blob && !cancelled) {
            const obj = URL.createObjectURL(blob);
            revoked = obj;
            setResolvedUrl(obj);
          } else if (!cancelled) {
            setResolvedUrl(undefined);
          }
        } catch {
          if (!cancelled) setResolvedUrl(undefined);
        }
      } else {
        setResolvedUrl(inputUrl);
      }
    })();

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [inputUrl]);

  return resolvedUrl;
}

