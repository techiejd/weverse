import { CssBaseline } from "@mui/material";
import { FC, ReactNode } from "react";
import { Header } from "./header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { lightConfiguration } from "./theme";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppState, useAppState } from "../context/appState";
import AuthDialog from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";

const RegisterModal = ({ appState }: { appState: AppState }) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const router = useRouter();
  const { registerRequested } = router.query;
  const [user, userLoading, userError] = useAuthState(appState.auth);
  useEffect(() => {
    const unauthorizedUser = !user && !userLoading && !userError;
    if (unauthorizedUser && registerRequested) {
      setAuthDialogOpen(true);
    }
  }, [user, userLoading, userError, setAuthDialogOpen, registerRequested]);
  return (
    <AuthDialog
      open={authDialogOpen}
      setOpen={setAuthDialogOpen}
      initialAuthAction={AuthAction.register}
    />
  );
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const appState = useAppState();
  return (
    <ThemeProvider theme={createTheme(lightConfiguration)}>
      <CssBaseline>
        {appState && <RegisterModal appState={appState} />}
        <Header />
        <main>{children}</main>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default Layout;
