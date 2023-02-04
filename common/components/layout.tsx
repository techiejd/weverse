import { Box } from "@mui/material";
import { ReactNode } from "react";
import HeaderStateProvider from "../context/header";
import FooterStateProvider from "../context/footer";
import { Footer } from "./footer";
import { Header } from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderStateProvider>
        <FooterStateProvider>
          <Header />
          <main>
            <Box pb={"72px"}>{children}</Box>
          </main>
          <Footer />
        </FooterStateProvider>
      </HeaderStateProvider>
    </>
  );
}
