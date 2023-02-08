import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useElementOnScreen from "../../../../../../../common/context/useElementOnScreen";

export type VideoProps = {
  muted?: boolean;
  threshold: number;
  controls?: boolean;
  controlsList?: string;
  disablePictureInPicture?: boolean;
};

const CandidateVideo = ({
  muted = true,
  disablePictureInPicture = true,
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
        backgroundColor: "yellow",
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
      >
        <source src="/ana14s.mp4" type="video/mp4" />
      </video>
    </Box>
  );
};

export default CandidateVideo;
