import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <Box pb={"72px"}>{children}</Box>
      </main>
      <Footer />
    </>
  );
}
