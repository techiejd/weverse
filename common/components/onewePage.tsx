import { Box } from "@mui/material";
import { Header } from "./header";
import { ComponentType, FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthDialog from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";
import { useAppState } from "../context/appState";

const RegisterModal = () => {
  //TODO(techiejd): Look into how to consolidate all AuthDialogs into one.
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const router = useRouter();
  const { registerRequested } = router.query;
  const { user, loading: userLoading } = useAppState().authState;
  useEffect(() => {
    const unauthorizedUser = !user && !userLoading;
    if (unauthorizedUser && registerRequested) {
      setAuthDialogOpen(true);
    }
  }, [user, userLoading, setAuthDialogOpen, registerRequested]);
  return (
    <AuthDialog
      open={authDialogOpen}
      setOpen={setAuthDialogOpen}
      initialAuthAction={AuthAction.register}
    />
  );
};

export const asOneWePage = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  const OWP = (props: P) => {
    return (
      <Box>
        <RegisterModal />
        <Header />
        <Component {...props} />
      </Box>
    );
  };
  return OWP;
};
