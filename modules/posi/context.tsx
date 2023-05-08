import { useRouter } from "next/router";
import { AppState } from "../../common/context/appState";
import { collection, doc, query, where } from "firebase/firestore";
import { socialProofConverter } from "../../common/context/weverse";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { posiFormDataConverter } from "./input/context";

export const useCurrentPosiId = () => {
  //TODO(techiejd): Go through codebase and replace with this.
  const router = useRouter();
  const { posiId } = router.query;
  return router.isReady ? String(posiId) : undefined;
};

export const useCurrentPosi = (appState: AppState) => {
  const posiId = useCurrentPosiId();
  console.log("posiId: ", posiId);
  return useDocumentData(
    posiId
      ? doc(appState.firestore, "impacts", posiId).withConverter(
          posiFormDataConverter
        )
      : undefined
  );
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
