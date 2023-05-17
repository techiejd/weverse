import { app } from "../utils/firebase";
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type User = {
  phoneNumber: string;
  name: string;
  id: string;
};

export type AppState = {
  user?: User; // TODO(techiejd): Firstly, deprecated. Secondly, I should split responsibility between storage and authentication.
  storage: FirebaseStorage;
  firestore: Firestore;
  auth: Auth;
};

const isDevEnvironment = process && process.env.NODE_ENV === "development";

const storage = (() => {
  const storage = getStorage(app);
  if (isDevEnvironment) connectStorageEmulator(storage, "localhost", 9199);
  return storage;
})();

const firestore = (() => {
  const firestore = getFirestore(app);
  if (isDevEnvironment) connectFirestoreEmulator(firestore, "localhost", 8080);
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

const AppContext = createContext<AppState | undefined>(undefined);

const SetAppContext = createContext<
  Dispatch<SetStateAction<AppState | undefined>> | undefined
>(undefined);

const AppStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [appState, setAppState] = useState<AppState | undefined>({
    storage: storage,
    firestore: firestore,
    auth: auth,
  });
  return (
    <AppContext.Provider value={appState}>
      <SetAppContext.Provider value={setAppState}>
        {children}
      </SetAppContext.Provider>
    </AppContext.Provider>
  );
};

export function useAppState() {
  return useContext(AppContext);
}

export function useSetAppState() {
  return useContext(SetAppContext);
}

export default AppStateProvider;
