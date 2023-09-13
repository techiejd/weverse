import { useRouter } from "next/router";
import { useInitiative } from "../../common/context/weverseUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, collection, where } from "firebase/firestore";
import {
  usePosiFormDataConverter,
  useSocialProofConverter,
} from "../../common/utils/firebase";
import { useAppState } from "../../common/context/appState";

export const useCurrentInitiative = () => {
  const router = useRouter();
  const { initiativeId } = router.query;
  return useInitiative(router.isReady ? String(initiativeId) : undefined);
};

export const useCurrentActions = () => {
  const appState = useAppState();
  const posiFormDataConverter = usePosiFormDataConverter();
  const [initiative] = useCurrentInitiative();
  return useCollectionData(
    initiative
      ? query(
          collection(appState.firestore, "impacts"),
          where("initiativeId", "==", initiative.id)
        ).withConverter(posiFormDataConverter)
      : undefined
  );
};

export const useCurrentImpacts = () => {
  const appState = useAppState();
  const [initiative] = useCurrentInitiative();
  const socialProofConverter = useSocialProofConverter();
  return useCollectionData(
    initiative
      ? query(
          collection(appState.firestore, "socialProofs"),
          where("forInitiative", "==", initiative.id)
        ).withConverter(socialProofConverter)
      : undefined
  );
};
