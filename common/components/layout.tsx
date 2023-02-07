import { Box } from "@mui/material";
import { ReactNode } from "react";
import HeaderStateProvider from "../context/header";
import { Header } from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderStateProvider>
        <Header />
        <main>
          <Box pb={"72px"}>{children}</Box>
        </main>
      </HeaderStateProvider>
    </>
  );
}
