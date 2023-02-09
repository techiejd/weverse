import { Box } from "@mui/material";
import { ReactNode } from "react";
import AppStateProvider from "../context/appState";
import HeaderStateProvider from "../context/header";
import { Header } from "./header";
import { LogInDialog } from "./logIn";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppStateProvider>
        <HeaderStateProvider>
          <Header />
          <LogInDialog />
          <main>
            <Box pb={"72px"}>{children}</Box>
          </main>
        </HeaderStateProvider>
      </AppStateProvider>
    </>
  );
}
