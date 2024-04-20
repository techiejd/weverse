import Header from "./header";
import "./global.css";
import { unstable_setRequestLocale } from "next-intl/server";
import { locale } from "../../functions/shared/src";

export function generateStaticParams() {
  return Object.values(locale.Values).map((locale) => ({ locale }));
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
