import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Rating,
  Stack,
} from "@mui/material";
import ImpactPage, { PageTypes } from "../../../../modules/posi/impactPage";
import { SocialProof } from "../../../../common/context/weverse";
import { AppState, useAppState } from "../../../../common/context/appState";
import { useMaker } from "../../../../common/context/weverseUtils";
import {
  useCurrentPosi,
  useCurrentPosiId,
  useCurrentSocialProofs,
} from "../../../../modules/posi/context";
import Media from "../../../../modules/posi/media";
import Support from "../../../../common/components/support";
import { getSharePropsForPosi } from "../../../../modules/posi/input/context";
import LoadingFab from "../../../../common/components/loadingFab";

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

const SupportImpact = ({ appState }: { appState: AppState }) => {
  const [posi, posiLoading, posiError] = useCurrentPosi(appState);
  const [maker, makerLoading, makerError] = useMaker(appState, posi?.makerId);
  return posi && maker ? (
    <Support
      howToSupport={maker.howToSupport ? maker.howToSupport : {}}
      shareProps={getSharePropsForPosi(posi)}
      addSocialProofPath={`/posi/${posi.id}/impact/upload`}
    />
  ) : (
    <LoadingFab />
  );
};

const Impact = () => {
  const posiId = useCurrentPosiId();
  const appState = useAppState();
  const ImpactContent = ({ appState }: { appState: AppState }) => {
    const [socialProofs, socialProofsLoading, socialProofsError] =
      useCurrentSocialProofs(appState);
    return socialProofs ? (
      <Stack p={1} spacing={1}>
        {socialProofs.map((socialProof, idx) => (
          <SocialProofCard
            socialProof={socialProof}
            key={socialProof.id ? socialProof.id : idx}
          />
        ))}
      </Stack>
    ) : (
      <CircularProgress />
    );
  };
  return posiId && appState ? (
    <ImpactPage id={posiId} type={PageTypes.impact}>
      <ImpactContent appState={appState} />
      <SupportImpact appState={appState} />
    </ImpactPage>
  ) : (
    <CircularProgress />
  );
};

export default Impact;
