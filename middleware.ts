import createMiddleware from "next-intl/middleware";
import { locale } from "./functions/shared/src";

// A list of all locales that are supported
const locales = Object.values(locale.Values);

export default createMiddleware({
  locales,
  // Used when no locale matches
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|es|fr|de|pl|pt)/:path*",
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
