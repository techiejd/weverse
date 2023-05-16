import { Box } from "@mui/material";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

const useElementOnScreen = (
  options: IntersectionObserverInit,
  targetRef: MutableRefObject<Element | null>
) => {
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries; //const entry = entries[0]
    setIsVisible(entry.isIntersecting);
  };

  const optionsMemo = useMemo(() => {
    return options;
  }, [options]);

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, optionsMemo);
    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [targetRef, optionsMemo]);

  return isVisible;
};

export type VideoProps = {
  muted?: boolean;
  threshold: number;
  src: string;
  controls?: boolean;
  controlsList?: string;
  disablePictureInPicture?: boolean;
  playsInline?: boolean;
};

export type ImageProps = {
  src: string;
};

const CandidateVideo = ({
  muted = true,
  disablePictureInPicture = true,
  playsInline = true,
  ...props
}: VideoProps) => {
  const [playing, setPlaying] = useState(false);
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: props.threshold,
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVisible = useElementOnScreen(options, videoRef);

  useEffect(() => {
    if (isVisible) {
      if (!playing) {
        videoRef?.current?.play();
        setPlaying(true);
      }
    } else {
      if (playing) {
        videoRef?.current?.pause();
        setPlaying(false);
      }
    }
  }, [isVisible, playing]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#E6E6E6",
      }}
    >
      <video controls preload="auto" width="640" height="264" data-setup="{}">
        <source
          src="http://localhost:9199/v0/b/webapp-dec4b.appspot.com/o/video_transcoding_output%2FIMG_1105-1%2Fmanifest.m3u8?alt=media&token=71afcda7-6a68-4b9a-8ab0-74dba6b21ac8"
          type="application/x-mpegURL"
        />
      </video>
    </Box>
  );
};

const CandidateImage = ({ src }: ImageProps) => {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#E6E6E6",
      }}
    />
  );
};

const Media = (props: { video?: VideoProps; image?: ImageProps }) => {
  return props.video ? (
    <CandidateVideo {...props.video} />
  ) : (
    <CandidateImage {...props.image!} />
  );
};

export default Media;
