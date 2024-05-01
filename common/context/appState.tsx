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
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator, User, Auth } from "firebase/auth";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { lightConfiguration } from "../components/theme";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { Locale } from "../../functions/shared/src";
import { useDocumentData } from "react-firebase-hooks/firestore";
import mixpanel from "mixpanel-browser";

const isDevEnvironment = process && process.env.NODE_ENV === "development";

mixpanel.init(
  isDevEnvironment
    ? process.env.NEXT_PUBLIC_MIXPANEL_TOKEN_DEV!
    : process.env.NEXT_PUBLIC_MIXPANEL_TOKEN_PROD!,
  {
    debug: true,
    persistence: "localStorage",
  }
);

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

type Languages = {
  primary: Locale;
  content: Locale[];
};

const weverse: {
  storage: FirebaseStorage;
  firestore: Firestore;
  authState: {
    user: User | undefined | null;
    loading: boolean;
  };
  auth: Auth;
  getStripe: () => Promise<Stripe | null>;
  languages: Languages;
  useSetLanguages: () => (languages: {
    primary: Locale;
    content: Locale[];
  }) => Promise<void>;
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
  languages: {
    primary: "en" as Locale,
    content: ["en"] as Locale[],
  },
  useSetLanguages: () => (languages: Languages) => Promise.resolve(),
};

const AppStateContext = createContext(weverse);

const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, loading, error] = useAuthState(weverse.auth);
  const [member] = useDocumentData(
    user ? doc(weverse.firestore, "members", user.uid as string) : undefined
  );
  const router = useRouter();
  const locale = (router.query.locale || "en") as Locale;
  const [cachedLanguages, setCachedLanguages] = useState<Languages>({
    primary: locale,
    content:
      member?.settings?.locales ||
      (member?.locale ? [member?.locale!] : [locale]),
  });

  useEffect(() => {
    if (member?.locale && member?.locale != locale) {
      router.push(`/${member?.locale}/${router.asPath.slice(3)}`);
    }
  }, [locale, member?.locale, router]);

  const useSetLanguages = useCallback(() => {
    return (languages: Languages) => {
      setCachedLanguages(languages);
      if (member && user?.uid) {
        const memberRef = doc(weverse.firestore, "members", user.uid);
        return updateDoc(memberRef, {
          locale: languages.primary,
          settings: {
            locales: languages.content,
          },
        });
      } else {
        router.push(`/${languages.primary}/${router.asPath.slice(3)}`);
      }
      return Promise.resolve();
    };
  }, [member, router, user?.uid]);

  useEffect(() => {
    weverse.auth.onIdTokenChanged(async (user) => {
      if (!user) {
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
    weverse.auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("resetting mixpanel");
        mixpanel.reset();
      } else {
        console.log("identifying mixpanel");
        mixpanel.identify(user.uid);
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = weverse.auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const appState = useMemo(() => {
    return {
      ...weverse,
      authState: { user, loading },
      languages: {
        primary: cachedLanguages.primary as Locale,
        content: cachedLanguages.content as Locale[],
      },
      useSetLanguages,
    };
  }, [
    user,
    loading,
    cachedLanguages.primary,
    cachedLanguages.content,
    useSetLanguages,
  ]);
  // TODO(techiejd): Do something about errors.

  //TODO(techiejd): Look into removing registermodal and header into somewhere else so that getstaticprops can be used.
  return (
    <AppStateContext.Provider value={appState}>
      <ThemeProvider theme={createTheme(lightConfiguration)}>
        <CssBaseline>
          <main>{children}</main>
        </CssBaseline>
      </ThemeProvider>
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  return useContext(AppStateContext);
}

export default AppProvider;
