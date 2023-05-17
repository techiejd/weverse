import { Ref, forwardRef } from "react";
import Link from "next/link";

const LinkBehavior = forwardRef(function LinkBehaviour(
  props: { href: string },
  ref: Ref<HTMLAnchorElement> | undefined
) {
  return <Link ref={ref} {...props} />;
});

export default LinkBehavior;
