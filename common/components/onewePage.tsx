import { Header } from "./header";
import { ComponentType, FC, Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthDialog from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";
import { useAppState } from "../context/appState";
import { Locale2Messages } from "../utils/translations";
import { NextIntlClientProvider } from "next-intl";

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
  // TODO(techiejd): Bring in the locale2Messages and put it as context.
  const OWP = (props: P) => {
    const appState = useAppState();
    return (
      <NextIntlClientProvider
        locale={appState.languages.primary}
        messages={(props as Locale2Messages)[appState.languages.primary]}
      >
        <Fragment>
          <RegisterModal />
          <Header locale2Messages={props as Locale2Messages} />
          <Component {...props} />
        </Fragment>
      </NextIntlClientProvider>
    );
  };
  return OWP;
};
