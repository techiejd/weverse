import buildUrl from "@googlicius/build-url";
import { useState } from "react";

// From https://usehooks-ts.com/react-hook/use-copy-to-clipboard
export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      alert(
        'Copiar al portapapeles no es compatible con tu navegador. Haz clic en "Compartir".'
      );
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      alert('Copiar al portapapeles falló. Haz clic en "Compartir".');
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

export const buildShareLinks = (invitedAsMaker: string, inviter: string) => {
  const path = buildUrl(`/makers/${invitedAsMaker}`, {
    queryParams: {
      invitedAsMaker,
      registerRequested: true,
      inviter
    },
  });
  const href = buildUrl(path, { returnAbsoluteUrl: true });
  return {path, href};
}