import { useRouter } from "next/router";
import { useMaker } from "../../common/context/weverseUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, collection, where } from "firebase/firestore";
import {
  posiFormDataConverter,
  socialProofConverter,
} from "../../common/utils/firebase";
import { useAppState } from "../../common/context/appState";

export const useCurrentMaker = () => {
  const router = useRouter();
  const { makerId } = router.query;
  return useMaker(router.isReady ? String(makerId) : undefined);
};

export const useCurrentActions = () => {
  const appState = useAppState();
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return useCollectionData(
    maker
      ? query(
          collection(appState.firestore, "impacts"),
          where("makerId", "==", maker.id)
        ).withConverter(posiFormDataConverter)
      : undefined
  );
};

export const useCurrentImpacts = () => {
  const appState = useAppState();
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return useCollectionData(
    maker
      ? query(
          collection(appState.firestore, "socialProofs"),
          where("forMaker", "==", maker.id)
        ).withConverter(socialProofConverter)
      : undefined
  );
};
