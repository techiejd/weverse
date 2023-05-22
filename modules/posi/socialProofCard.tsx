import {
  CardHeader,
  Stack,
  Box,
  CircularProgress,
  Rating,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { SocialProof } from "../../functions/shared/src";
import { useAppState, AppState } from "../../common/context/appState";
import { useAction, useMaker } from "../../common/context/weverseUtils";
import Media from "./media";

const SocialProofCard = ({
  socialProof,
  showMaker = true,
  showAction = true,
}: {
  socialProof: SocialProof;
  showMaker?: boolean;
  showAction?: boolean;
}) => {
  const appState = useAppState();
  const SocialProofCardHeader = ({ appState }: { appState: AppState }) => {
    const [byMaker, byMakerLoading, byMakerError] = useMaker(
      appState,
      socialProof.byMaker
    );
    return (
      <CardActionArea href={`/makers/${socialProof.byMaker}`}>
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
      </CardActionArea>
    );
  };
  const SocialProofCardContent = ({ appState }: { appState: AppState }) => {
    const [action, actionLoading, actionError] = useAction(
      appState,
      showAction ? socialProof.forAction : undefined
    );
    const [forMaker, forMakerLoading, forMakerError] = useMaker(
      appState,
      showMaker ? socialProof.forMaker : undefined
    );
    return (
      <>
        {action && <CardContent>Por la acción: {action.summary}</CardContent>}
        {forMaker && (
          <CardContent>Para el o la Maker: {forMaker.name}</CardContent>
        )}
      </>
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
      {appState && <SocialProofCardContent appState={appState} />}
    </Card>
  );
};

export default SocialProofCard;
