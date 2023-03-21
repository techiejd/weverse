import { Box, CssBaseline } from "@mui/material";
import { FC, ReactNode } from "react";
import AppStateProvider from "../context/appState";
import HeaderStateProvider from "../context/header";
import { Header } from "./header";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { withAuthUser } from "next-firebase-auth";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <AppStateProvider>
          <HeaderStateProvider>
            <Header />
            <main>
              <Box>{children}</Box>
            </main>
          </HeaderStateProvider>
        </AppStateProvider>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default withAuthUser<{ children: ReactNode }>({})(Layout);
