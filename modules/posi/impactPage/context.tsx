import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useRef,
} from "react";
import { RWebShare } from "react-web-share";

export const ImpactPageContext = createContext<
  { launchShare: () => void } | undefined
>(undefined);

const ImpactPageProvider = ({
  text,
  url,
  children,
}: {
  text: string;
  url: string;
  children: ReactNode;
}) => {
  const webShareRef = useRef<HTMLDivElement>(null);
  const launchWebSharePortal = () => {
    webShareRef?.current?.click();
  };
  return (
    <ImpactPageContext.Provider value={{ launchShare: launchWebSharePortal }}>
      <RWebShare
        data={{
          text: "Like humans, flamingos make friends for life",
          url: "https://on.natgeo.com/2zHaNup",
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <div ref={webShareRef}></div>
      </RWebShare>
      {children}
    </ImpactPageContext.Provider>
  );
};

export const useImpactPageContext = () => {
  return useContext(ImpactPageContext);
};

export default ImpactPageProvider;
