import buildUrl from "@googlicius/build-url";
import { useTranslations } from "next-intl";
import { useState } from "react";

// From https://usehooks-ts.com/react-hook/use-copy-to-clipboard
export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const copyTranslations = useTranslations("makers.invite.copy");

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      alert(copyTranslations("incompatibleBrowser"));
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      alert(copyTranslations("copyFailed"));
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

export const buildShareLinks = (invitedInitiative: string, inviter: string) => {
  const path = buildUrl(`/initiatives/${invitedInitiative}`, {
    queryParams: {
      invitedInitiative,
      registerRequested: true,
      inviter,
    },
  });
  const href = buildUrl(path, { returnAbsoluteUrl: true });
  return { path, href };
};
