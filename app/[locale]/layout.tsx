"use client;";
import Header from "./header";
import "./global.css";
import { unstable_setRequestLocale } from "next-intl/server";
import { locale } from "../../functions/shared/src";
import { AppStateProvider } from "./appState";
import dynamic from "next/dynamic";
const DynamicDrawer = dynamic(() => import("./drawer"), {
  ssr: false,
});

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
        <AppStateProvider>
          <Header />
          <DynamicDrawer>
            <main>{children}</main>
          </DynamicDrawer>
        </AppStateProvider>
      </body>
    </html>
  );
}
