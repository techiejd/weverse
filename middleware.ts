import createMiddleware from "next-intl/middleware";
import { locale } from "./functions/shared/src";
import { NextRequest } from "next/server";

// A list of all locales that are supported
const locales = Object.values(locale.Values);
const handleI18nRouting = createMiddleware({
  locales,
  // Used when no locale matches
  defaultLocale: "en",
});

const middleware = (req: NextRequest) => {
  const res = handleI18nRouting(req);
  res.headers.set("x-pathname", req.nextUrl.pathname);

  return res;
};

export default middleware;

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|es|fr|de|pl|pt)/:path*",
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
