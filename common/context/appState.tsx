import { initializeApp } from "firebase/app";
import {
  connectDatabaseEmulator,
  Database,
  getDatabase,
} from "firebase/database";
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
  user?: User;
  db: Database;
};

const db = (() => {
  const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_REACT_APP_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_REACT_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID,
  });

  const db = getDatabase(app);
  return db;
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
