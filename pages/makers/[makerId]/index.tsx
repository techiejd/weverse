import { Box, CircularProgress, Stack } from "@mui/material";
import {
  query,
  collection,
  where,
  CollectionReference,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { AppState, useAppState } from "../../../common/context/appState";
import MakerCard from "../../../modules/makers/MakerCard";
import ImpactsList from "../../../modules/posi/impactsList";
import {
  posiFormDataConverter,
  PosiFormData,
} from "../../../modules/posi/input/context";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { makerConverter } from "../../../common/context/weverse";
import LoadingFab from "../../../common/components/loadingFab";
import Support from "../../../modules/posi/impactPage/about/Support";

const SupportMaker = ({
  appState,
  makerId,
}: {
  appState: AppState;
  makerId: string;
}) => {
  const makerDocRef = doc(appState.firestore, "makers", makerId);
  const [maker, makerLoading, makerError] = useDocumentData(
    makerDocRef.withConverter(makerConverter)
  );

  console.log(maker);
  console.log(makerId);
  console.log(makerError);
  console.log(makerLoading);
  return maker ? (
    <Support
      howToSupport={maker.howToSupport ? maker.howToSupport : {}}
      shareProps={{
        url: "",
        text: "",
        title: "",
      }}
    />
  ) : (
    <LoadingFab />
  );
};

const MakerPage = () => {
  const appState = useAppState();
  const router = useRouter();
  const { makerId } = router.query;

  const q =
    appState && makerId
      ? query(
          collection(appState.firestore, "impacts"),
          where("makerId", "==", makerId)
        ).withConverter(posiFormDataConverter)
      : undefined;
  return appState ? (
    <Box>
      <Stack>
        <MakerCard makerId={String(makerId)} />
        {q == undefined ? (
          <CircularProgress />
        ) : (
          <ImpactsList
            impactsQuery={
              // TODO(techiejd: Look into this casting why necessary? Something funky with zod.
              q as CollectionReference<PosiFormData>
            }
          />
        )}
      </Stack>
      <SupportMaker appState={appState} makerId={String(makerId)} />
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default MakerPage;
