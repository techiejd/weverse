import { Ref, forwardRef, useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";

// TODO(techiejd): Check all urls are with our hosting.
export const formUrl = z.string().url();
export const mediaType = z.enum(["video", "img"]);
export type MediaType = z.infer<typeof mediaType>;
export const media = z.object({
  type: mediaType,
  url: formUrl,
});
export type Media = z.infer<typeof media>;

export const isDevEnvironment =
  process && process.env.NODE_ENV === "development";

export const LinkBehavior = forwardRef(function LinkBehaviour(
  props: { href: string },
  ref: Ref<HTMLAnchorElement> | undefined
) {
  return <Link ref={ref} {...props} />;
});

export const useHostname = () => {
  const [hostname, setHostName] = useState<undefined | string>();
  useEffect(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : undefined;
    if (origin) {
      setHostName(origin);
    }
  }, []);
  return hostname;
};
