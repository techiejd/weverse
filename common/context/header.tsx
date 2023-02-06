import React, { createContext, useContext, useState } from "react";

export interface HeaderState {
  exchangeInfo: {
    allowancePrepend: string;
    allowance: string;
  };
}

const HeaderContext = createContext<HeaderState | undefined>(undefined);

const SetHeaderContext = createContext<
  React.Dispatch<React.SetStateAction<HeaderState>> | undefined
>(undefined);

const HeaderStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [headerState, setHeaderState] = useState({
    exchangeInfo: {
      allowancePrepend: "",
      allowance: "",
    },
  });
  return (
    <HeaderContext.Provider value={headerState}>
      <SetHeaderContext.Provider value={setHeaderState}>
        {children}
      </SetHeaderContext.Provider>
    </HeaderContext.Provider>
  );
};

export function useHeaderState() {
  return useContext(HeaderContext);
}

export function useSetHeaderContext() {
  return useContext(SetHeaderContext);
}

export default HeaderStateProvider;
