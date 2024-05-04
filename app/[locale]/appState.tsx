"use client";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
} from "react";

interface AppStateContextProps {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const AppStateContext = createContext<AppStateContextProps>({
  drawerOpen: false,
  setDrawerOpen: () => null,
});

const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppStateContext.Provider value={{ drawerOpen, setDrawerOpen }}>
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

export { AppStateProvider, useDrawer };
