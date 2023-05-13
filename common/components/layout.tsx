import { Box, CssBaseline } from "@mui/material";
import { FC, ReactNode } from "react";
import AppStateProvider from "../context/appState";
import { Header } from "./header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { lightConfiguration } from "./theme";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={createTheme(lightConfiguration)}>
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

export default Layout;
