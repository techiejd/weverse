import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import ImpactPage, { PageTypes } from "../../../../modules/posi/impactPage";
import { SocialProof } from "../../../../common/context/weverse";
import { AppState, useAppState } from "../../../../common/context/appState";
import { useMaker } from "../../../../common/context/weverseUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query } from "firebase/firestore";
import {
  useCurrentPosiId,
  useCurrentSocialProofs,
} from "../../../../modules/posi/context";

const SocialProofCard = ({ socialProof }: { socialProof: SocialProof }) => {
  const appState = useAppState();
  const SocialProofCardContent = ({ appState }: { appState: AppState }) => {
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
        <SocialProofCardContent appState={appState} />
      ) : (
        <CircularProgress />
      )}
    </Card>
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
    </ImpactPage>
  ) : (
    <CircularProgress />
  );
};

export default Impact;
