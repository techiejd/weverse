import React, { createContext, useContext, useState } from "react";

export interface FooterState {
  navigationLinks: {
    weRace: string;
  };
}

const FooterContext = createContext<FooterState | undefined>(undefined);

const SetFooterContext = createContext<
  React.Dispatch<React.SetStateAction<FooterState>> | undefined
>(undefined);

const FooterStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [footerState, setFooterState] = useState({
    navigationLinks: {
      weRace: "/v1/weRace/vote/interests",
    },
  });
  return (
    <FooterContext.Provider value={footerState}>
      <SetFooterContext.Provider value={setFooterState}>
        {children}
      </SetFooterContext.Provider>
    </FooterContext.Provider>
  );
};

export function useFooterState() {
  return useContext(FooterContext);
}

export function useSetFooterContext() {
  return useContext(SetFooterContext);
}

export default FooterStateProvider;
