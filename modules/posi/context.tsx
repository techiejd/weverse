import { useRouter } from "next/router";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  useAction,
  useInitiative as useInitiativeWeVerseUtils,
} from "../../common/context/weverseUtils";
import { useSocialProofConverter } from "../../common/utils/firebase";
import { useAppState } from "../../common/context/appState";
import { PosiFormData } from "../../functions/shared/src";

export const useCurrentPosiPath = () => {
  //TODO(techiejd): Go through codebase and replace with this.
  const router = useRouter();
  const { posiId, userId, initiativeId } = router.query;
  return router.isReady
    ? `/members/${userId}/initiatives/${initiativeId}/actions/${posiId}`
    : undefined;
};

export const useCurrentPosi = () => useAction(useCurrentPosiPath());

export const useInitiative = (action: { path?: string } | undefined) =>
  useInitiativeWeVerseUtils(
    action?.path?.slice(0, action?.path?.indexOf("/actions"))
  );

export const useCurrentSocialProofs = () => {
  const appState = useAppState();
  const posiPath = useCurrentPosiPath();
  const socialProofConverter = useSocialProofConverter();
  return useCollectionData(
    posiPath
      ? collection(
          appState.firestore,
          posiPath + "/testimonials"
        ).withConverter(socialProofConverter)
      : undefined
  );
};
