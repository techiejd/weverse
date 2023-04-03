import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { FC, ReactNode, useMemo } from "react";
import AppStateProvider from "../context/appState";
import { Header } from "./header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { configuration } from "./theme";
import { withAuthUser } from "next-firebase-auth";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() => {
    console.log(configuration(prefersDarkMode));
    return createTheme(configuration(prefersDarkMode));
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <AppStateProvider>
          <Header />
          <main>
            <Box>{children}</Box>
          </main>
        </AppStateProvider>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default withAuthUser<{ children: ReactNode }>({})(Layout);
