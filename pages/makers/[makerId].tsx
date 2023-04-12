import { CircularProgress, Stack } from "@mui/material";
import {
  query,
  collection,
  where,
  CollectionReference,
} from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import MakerCard from "../../modules/makers/MakerCard";
import {
  PosiFormData,
  posiFormDataConverter,
} from "../../modules/posi/input/context";
import { useRouter } from "next/router";
import ImpactsList from "../../modules/posi/impactsList";
import { makerConverter } from "../../common/context/weverse";

const MakerPage = () => {
  const appState = useAppState();
  const router = useRouter();
  const { makerId } = router.query;

  const q = appState
    ? query(
        collection(appState.firestore, "impacts"),
        where("makerId", "==", makerId)
      ).withConverter(posiFormDataConverter)
    : undefined;
  return appState ? (
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
  ) : (
    <CircularProgress />
  );
};

export default MakerPage;
