import { useRouter } from "next/router";
import { AppState } from "../../common/context/appState";
import { useMaker } from "../../common/context/weverseUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, collection, where } from "firebase/firestore";
import {
  posiFormDataConverter,
  socialProofConverter,
} from "../../common/utils/firebase";

export const useCurrentMaker = (appState: AppState) => {
  const router = useRouter();
  const { makerId } = router.query;
  return useMaker(appState, router.isReady ? String(makerId) : undefined);
};

export const useCurrentActions = (appState: AppState) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return useCollectionData(
    maker
      ? query(
          collection(appState.firestore, "impacts"),
          where("makerId", "==", maker.id)
        ).withConverter(posiFormDataConverter)
      : undefined
  );
};

export const useCurrentImpacts = (appState: AppState) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return useCollectionData(
    maker
      ? query(
          collection(appState.firestore, "socialProofs"),
          where("forMaker", "==", maker.id)
        ).withConverter(socialProofConverter)
      : undefined
  );
};
