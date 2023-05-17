import { useRouter } from "next/router";
import { AppState } from "../../common/context/appState";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAction } from "../../common/context/weverseUtils";
import { socialProofConverter } from "../../common/utils/firebase";

export const useCurrentPosiId = () => {
  //TODO(techiejd): Go through codebase and replace with this.
  const router = useRouter();
  const { posiId } = router.query;
  return router.isReady ? String(posiId) : undefined;
};

export const useCurrentPosi = (appState: AppState) => {
  const posiId = useCurrentPosiId();
  return useAction(appState, posiId);
};

export const useCurrentSocialProofs = (appState: AppState) => {
  const posiId = useCurrentPosiId();
  return useCollectionData(
    posiId
      ? query(
          collection(appState.firestore, "socialProofs"),
          where("forAction", "==", posiId)
        ).withConverter(socialProofConverter)
      : undefined
  );
};
