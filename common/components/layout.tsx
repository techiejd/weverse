import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { FC, ReactNode, useMemo } from "react";
import AppStateProvider from "../context/appState";
import HeaderStateProvider from "../context/header";
import { Header } from "./header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { configuration } from "./theme";
import { withAuthUser } from "next-firebase-auth";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode: prefersDarkMode ? "dark" : "light",
          },
        },
        configuration
      ),
    [prefersDarkMode]
  );

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
