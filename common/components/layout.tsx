import { Box, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import AppStateProvider from "../context/appState";
import HeaderStateProvider from "../context/header";
import { Header } from "./header";
import { LogInDialog } from "./logIn";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <AppStateProvider>
          <HeaderStateProvider>
            <Header />
            <LogInDialog />
            <main>
              <Box pb={"72px"}>{children}</Box>
            </main>
          </HeaderStateProvider>
        </AppStateProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}
