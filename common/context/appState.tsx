import {
  connectDatabaseEmulator,
  Database,
  getDatabase,
} from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { app } from "../utils/firebase";

export type User = {
  phoneNumber: string;
  name: string;
  id: string;
};

export type AppState = {
  user?: User;
  db: Database;
  storage: FirebaseStorage;
};

const db = (() => {
  const db = getDatabase(app);
  return db;
})();

const storage = (() => {
  const storage = getStorage(app);
  return storage;
})();

const AppContext = createContext<AppState | undefined>(undefined);

const SetAppContext = createContext<
  Dispatch<SetStateAction<AppState | undefined>> | undefined
>(undefined);

const AppStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [appState, setAppState] = useState<AppState | undefined>({
    db: db,
    storage: storage,
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
