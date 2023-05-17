import { ReactNode, useRef } from "react";
import { RWebShare } from "react-web-share";
import useHostname from "../utils/useHostname";

export type ShareProps = {
  title: string;
  text: string;
  path: string;
};

const ShareActionArea = ({
  children,
  shareProps,
  onClick,
}: {
  children: ReactNode;
  shareProps: ShareProps;
  onClick?: () => void;
}) => {
  const webShareRef = useRef<HTMLDivElement>(null);
  const hostname = useHostname();
  const { title, text, path } = shareProps;
  const shareData = { title, text, url: hostname ? hostname + path : path };
  return (
    <RWebShare data={shareData} onClick={onClick}>
      {children}
    </RWebShare>
  );
};

export default ShareActionArea;
