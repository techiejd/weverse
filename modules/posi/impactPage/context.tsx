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
  title,
  text,
  url,
  children,
}: {
  title?: string;
  text?: string;
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
          title: title,
          text: text,
          url: url,
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
