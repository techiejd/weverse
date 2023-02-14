import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useElementOnScreen from "../../../../../../common/context/useElementOnScreen";

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
      }}
    >
      <video
        width="160vh"
        height="100%"
        style={{
          minWidth: "100%",
          minHeight: "54vw",
          position: "absolute",
          left: "50%" /* % of surrounding element */,
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        ref={videoRef}
        muted={muted}
        controls={props.controls}
        controlsList={props.controlsList}
        disablePictureInPicture={disablePictureInPicture}
        loop
        playsInline={playsInline}
      >
        <source src={props.src} type="video/mp4" />
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
      }}
    />
  );
};

const CandidateMedia = (props: { video?: VideoProps; image?: ImageProps }) => {
  return props.video ? (
    <CandidateVideo {...props.video} />
  ) : (
    <CandidateImage {...props.image!} />
  );
};

export default CandidateMedia;
