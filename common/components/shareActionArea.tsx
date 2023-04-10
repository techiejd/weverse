import { ReactNode, useRef } from "react";
import { RWebShare } from "react-web-share";

export type ShareProps = {
  title: string;
  text: string;
  url: string;
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
  return (
    <RWebShare data={shareProps} onClick={onClick}>
      {children}
    </RWebShare>
  );
};

export default ShareActionArea;
