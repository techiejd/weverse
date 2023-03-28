import { useRef } from "react";
import { RWebShare } from "react-web-share";

const WebSharePortal = ({ text, url }: { text: string; url: string }) => {
  const webShareRef = useRef<HTMLDivElement>(null);
  const launchWebSharePortal = () => {
    webShareRef?.current?.click();
  };
  return (
    
  );
};

export default WebSharePortal;
