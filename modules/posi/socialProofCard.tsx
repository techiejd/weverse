import {
  CardHeader,
  Stack,
  Box,
  CircularProgress,
  Rating,
  Card,
} from "@mui/material";
import { SocialProof } from "shared";
import { useAppState, AppState } from "../../common/context/appState";
import { useMaker } from "../../common/context/weverseUtils";
import Media from "./media";

const SocialProofCard = ({ socialProof }: { socialProof: SocialProof }) => {
  const appState = useAppState();
  const SocialProofCardHeader = ({ appState }: { appState: AppState }) => {
    const [byMaker, byMakerLoading, byMakerError] = useMaker(
      appState,
      socialProof.byMaker
    );
    return (
      <CardHeader
        title={
          <Stack
            direction={"row"}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Box pr={2}>
              {byMaker ? `${byMaker.name}: ` : <CircularProgress />}
            </Box>
            <Rating value={socialProof.rating} />
          </Stack>
        }
      />
    );
  };
  return (
    <Card sx={{ width: "100%" }}>
      {appState ? (
        <SocialProofCardHeader appState={appState} />
      ) : (
        <CircularProgress />
      )}
      {socialProof.videoUrl && (
        <Box
          sx={{
            height: "50vh",
            width: "100%",
          }}
        >
          <Media
            video={{
              threshold: 0.9,
              muted: false,
              controls: true,
              controlsList:
                "play volume fullscreen nodownload noplaybackrate notimeline",
              disablePictureInPicture: true,
              src: socialProof.videoUrl,
            }}
          />
        </Box>
      )}
    </Card>
  );
};

export default SocialProofCard;
