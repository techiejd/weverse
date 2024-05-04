"use client;";
import Header from "./header";
import "./global.css";
import { unstable_setRequestLocale } from "next-intl/server";
import { locale } from "../../functions/shared/src";
import Drawer from "./drawer/drawer";
import { AppStateProvider } from "./appState";

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
          <Drawer>
            <main>{children}</main>
          </Drawer>
        </AppStateProvider>
      </body>
    </html>
  );
}
