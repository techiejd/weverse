import { Ref, forwardRef } from "react";
import Link from "next/link";
import { z } from "zod";

// TODO(techiejd): Check all urls are with our hosting.
export const formUrl = z.string().url();

export const isDevEnvironment =
  process && process.env.NODE_ENV === "development";

export const LinkBehavior = forwardRef(function LinkBehaviour(
  props: { href: string },
  ref: Ref<HTMLAnchorElement> | undefined
) {
  return <Link ref={ref} {...props} />;
});
