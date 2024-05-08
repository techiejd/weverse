"use client";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
} from "react";
import {
  Locale,
  Member,
  member as memberSchema,
} from "../../functions/shared/src";
import {
  connectFirestoreEmulator,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import nookies from "nookies";

const isDevEnvironment = process && process.env.NODE_ENV === "development";

export const creds = {
  apiKey: String(process.env.NEXT_PUBLIC_REACT_APP_API_KEY),
  authDomain: String(process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN),
  projectId: String(process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID),
  storageBucket: String(process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET),
  messagingSenderId: String(
    process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID
  ),
  appId: String(process.env.NEXT_PUBLIC_REACT_APP_ID),
  measurementId: String(process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID),
};

export const app = initializeApp(creds);

export const firestore = (() => {
  const firestore = getFirestore(app);
  if (isDevEnvironment && !(firestore as any)._settingsFrozen)
    // https://stackoverflow.com/questions/71574102/firebase-error-firestore-has-already-been-started-and-its-settings-can-no-lon
    connectFirestoreEmulator(firestore, "localhost", 8080);
  return firestore;
})();

type Languages = {
  primary: Locale;
  content: Locale[];
};

const weverse: {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  languages: Languages;
  useSetPrimaryLanguage: () => (primary: Locale) => Promise<void>;
  useSetContentLanguages: () => (languages: Locale[]) => Promise<void>;
  refreshLanguages: () => void;
} = {
  drawerOpen: false,
  setDrawerOpen: () => null,
  languages: {
    primary: "en" as Locale,
    content: ["en"] as Locale[],
  },
  useSetPrimaryLanguage: () => (primary: Locale) => Promise.resolve(),
  useSetContentLanguages: () => (languages: Locale[]) => Promise.resolve(),
  refreshLanguages: () => null,
};

const AppStateContext = createContext(weverse);

const AppStateProvider: FC<{
  children: ReactNode;
  member?: Member;
}> = ({ children, member }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const l = useLocale() as Locale;
  const [cachedLanguages, setCachedLanguages] = useState<Languages>({
    primary: member?.locale || l,
    content:
      member?.settings?.locales || (member?.locale ? [member?.locale!] : [l]),
  });
  const [nextLanguageRoute, setNextLanguageRoute] = useState<string | null>(
    pathName
  );
  const memberConverter = useMemo(
    () => ({
      toFirestore: (data: WithFieldValue<Member>): DocumentData => {
        const { locale, createdAt, ...others } = data;
        const localizedData = {
          ...others,
          createdAt: createdAt ? createdAt : serverTimestamp(),
          locale: locale ? locale : l ?? "undefined", // Add the locale field to the data being sent
        };
        return localizedData;
      },
      fromFirestore: (snapshot: QueryDocumentSnapshot): Member => {
        const data = snapshot.data();
        return memberSchema.parse({
          ...data,
          path: snapshot.ref.path,
        });
      },
    }),
    [l]
  );

  const useSetPrimaryLanguage = useCallback(() => {
    return async (primary: Locale) => {
      setCachedLanguages((languages) => ({ ...languages, primary }));
      if (member && member.path) {
        const memberRef = doc(firestore, member.path).withConverter(
          memberConverter
        );
        await updateDoc(memberRef, {
          locale: primary,
        });
      } else {
        setNextLanguageRoute((nextLanguageRoute) => {
          return nextLanguageRoute
            ? `/${primary}/${nextLanguageRoute.slice(4)}`
            : null;
        });
      }
    };
  }, [member, memberConverter]);
  const useSetContentLanguages = useCallback(() => {
    return async (languages: Locale[]) => {
      setCachedLanguages((cachedLanguages) => ({
        ...cachedLanguages,
        content: languages,
      }));
      if (member && member.path) {
        const memberRef = doc(firestore, member.path).withConverter(
          memberConverter
        );
        await updateDoc(memberRef, {
          settings: {
            locales: languages,
          },
        });
      } else {
        console.log("Setting content languages in cookie");
        console.log({ languages });
        nookies.set(undefined, "contentLanguages", languages.toString(), {
          path: "/",
        });
      }
    };
  }, [member, memberConverter]);

  const refreshLanguages = useCallback(() => {
    console.log("Refreshing languages");
    if (nextLanguageRoute) {
      console.log("Pushing route: ", nextLanguageRoute);
      router.push(nextLanguageRoute);
    }
  }, [nextLanguageRoute, router]);

  return (
    <AppStateContext.Provider
      value={{
        drawerOpen,
        setDrawerOpen,
        languages: {
          primary: cachedLanguages.primary as Locale,
          content: cachedLanguages.content as Locale[],
        },
        useSetPrimaryLanguage,
        useSetContentLanguages,
        refreshLanguages,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to access the drawer context
const useDrawer = (): {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
} => {
  const context = useContext(AppStateContext);
  return context;
};

const useLanguages = (): {
  languages: Languages;
  useSetPrimaryLanguage: () => (primary: Locale) => Promise<void>;
  useSetContentLanguages: () => (languages: Locale[]) => Promise<void>;
  refreshLanguages: () => void;
} => {
  const context = useContext(AppStateContext);
  return context;
};

export { AppStateProvider, useDrawer, useLanguages };
