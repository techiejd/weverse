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
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { lightConfiguration } from "../components/theme";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { AbstractIntlMessages, useLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { Locale } from "../../functions/shared/src";
import { useCurrentMember, useMember } from "./weverseUtils";

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
  messages?: AbstractIntlMessages;
}> = ({ children, messages }) => {
  const [user, loading, error] = useAuthState(weverse.auth);
  const [member] = useCurrentMember();
  const router = useRouter();
  const locale = (router.locale || "en") as Locale;
  const [cachedLanguages, setCachedLanguages] = useState<Languages>({
    primary: locale,
    content: [locale],
  });

  useEffect(() => {
    setCachedLanguages((cachedLanguages) => ({
      primary: member?.locale || cachedLanguages.primary,
      content: member?.settings?.locales || cachedLanguages.content,
    }));
  }, [member?.locale, member?.settings?.locales]);

  const useSetLanguages = useCallback(() => {
    return (languages: Languages) => {
      setCachedLanguages(languages);
      if (member) {
        const memberRef = doc(weverse.firestore, "members", member.id!);
        return updateDoc(memberRef, {
          locale: languages.primary,
          settings: {
            locales: languages.content,
          },
        });
      }
      return Promise.resolve();
    };
  }, [member]);

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
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider theme={createTheme(lightConfiguration)}>
          <CssBaseline>
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
