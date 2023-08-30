import { useRouter } from "next/router";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAction } from "../../common/context/weverseUtils";
import { useSocialProofConverter } from "../../common/utils/firebase";
import { useAppState } from "../../common/context/appState";

export const useCurrentPosiId = () => {
  //TODO(techiejd): Go through codebase and replace with this.
  const router = useRouter();
  const { posiId } = router.query;
  return router.isReady ? String(posiId) : undefined;
};

export const useCurrentPosi = () => {
  const posiId = useCurrentPosiId();
  return useAction(posiId);
};

export const useCurrentSocialProofs = () => {
  const appState = useAppState();
  const posiId = useCurrentPosiId();
  const socialProofConverter = useSocialProofConverter();
  return useCollectionData(
    posiId
      ? query(
          collection(appState.firestore, "socialProofs"),
          where("forAction", "==", posiId)
        ).withConverter(socialProofConverter)
      : undefined
  );
};
