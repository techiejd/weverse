import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import PageInteractionListener from "@iroomit/page-interaction-listener";

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

type MediaBase = {
  objectFit?: "contain" | "cover";
};

export type VideoProps = MediaBase & {
  muted?: boolean;
  threshold: number;
  src: string;
  controls?: boolean;
  controlsList?: string;
  disablePictureInPicture?: boolean;
  playsInline?: boolean;
};

export type ImageProps = MediaBase & {
  src: string;
};

const CandidateVideo = ({
  muted = true,
  disablePictureInPicture = true,
  playsInline = true,
  objectFit = "contain",
  ...props
}: VideoProps) => {
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
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
        if (muted) {
          videoRef?.current?.play();
          setPlaying(true);
        } else if (userInteracted) {
          videoRef?.current?.play();
          setPlaying(true);
        }
      }
    } else {
      if (playing) {
        videoRef?.current?.pause();
        setPlaying(false);
      }
    }
  }, [isVisible, playing, muted, userInteracted]);

  useEffect(() => {
    PageInteractionListener.addListener(() => {
      setUserInteracted(true);
    });
  }, []);

  return (
    <video
      height={"100%"}
      width={"100%"}
      style={{ objectFit: objectFit }}
      ref={videoRef}
      muted={muted}
      controls={props.controls}
      controlsList={props.controlsList}
      disablePictureInPicture={disablePictureInPicture}
      loop
      playsInline={playsInline}
      preload="metadata"
    >
      <source src={props.src} type="video/mp4" />
    </video>
  );
};

const CandidateImage = ({ objectFit = "cover", src }: ImageProps) => {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: objectFit,
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
