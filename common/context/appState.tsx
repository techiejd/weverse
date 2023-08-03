import { app } from "../utils/firebase";
import {
  getStorage,
  connectStorageEmulator,
  FirebaseStorage,
} from "firebase/storage";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator, User, Auth } from "firebase/auth";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthDialog from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";
import { Header } from "../components/header";
import { lightConfiguration } from "../components/theme";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { AbstractIntlMessages } from "next-intl";
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

const isDevEnvironment = process && process.env.NODE_ENV === "development";

const storage = (() => {
  const storage = getStorage(app);
  if (isDevEnvironment) connectStorageEmulator(storage, "localhost", 9199);
  return storage;
})();

const firestore = (() => {
  const firestore = getFirestore(app);
  if (isDevEnvironment && !(firestore as any)._settingsFrozen)
    // https://stackoverflow.com/questions/71574102/firebase-error-firestore-has-already-been-started-and-its-settings-can-no-lon
    connectFirestoreEmulator(firestore, "localhost", 8080);
  return firestore;
})();

const auth = (() => {
  const auth = getAuth(app);
  if (isDevEnvironment)
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
  return auth;
})();

let stripePromise: Promise<Stripe | null>;

const weverse: {
  storage: FirebaseStorage;
  firestore: Firestore;
  authState: {
    user: User | undefined | null;
    loading: boolean;
  };
  auth: Auth;
  getStripe: () => Promise<Stripe | null>;
} = {
  storage: storage,
  firestore: firestore,
  authState: { user: undefined, loading: false },
  auth: auth,
  getStripe: () => {
    if (!stripePromise) {
      stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
    }
    return stripePromise;
  },
};

const AppStateContext = createContext(weverse);

const AppProvider: React.FC<{
  children: React.ReactNode;
  messages?: AbstractIntlMessages;
}> = ({ children, messages }) => {
  const [appState, setAppState] = useState(weverse);
  const [user, loading, error] = useAuthState(appState.auth);
  // TODO(techiejd): Do something about errors.
  useEffect(() => {
    setAppState((appState) => ({
      ...appState,
      authState: { user, loading },
    }));
  }, [setAppState, user, loading]);

  //TODO(techiejd): Look into removing registermodal and header into somewhere else so that getstaticprops can be used.
  return (
    <AppStateContext.Provider value={appState}>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider theme={createTheme(lightConfiguration)}>
          <CssBaseline>
            <RegisterModal />
            <Header />
            <main>{children}</main>
          </CssBaseline>
        </ThemeProvider>
      </NextIntlClientProvider>
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  return useContext(AppStateContext);
}

export default AppProvider;
