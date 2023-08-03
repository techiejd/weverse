import { ReactNode } from "react";
import { RWebShare } from "react-web-share";
import buildUrl from "@googlicius/build-url";

export type ShareProps = {
  title: string;
  text?: string;
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
  const { title, text: textIn, path } = shareProps;
  const text = textIn ? textIn : title;
  const shareData = {
    title,
    text,
    url: buildUrl(path, { returnAbsoluteUrl: true }),
  };
  return (
    <RWebShare data={shareData} onClick={onClick}>
      {children}
    </RWebShare>
  );
};

export default ShareActionArea;
