import { useRouter } from "next/router";
import {
  useCurrentMember,
  useInitiative,
} from "../../common/context/weverseUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, collection, where } from "firebase/firestore";
import {
  usePosiFormDataConverter,
  useSocialProofConverter,
} from "../../common/utils/firebase";
import { useAppState } from "../../common/context/appState";

export const useCurrentInitiative = () => {
  const router = useRouter();
  const [currentMember] = useCurrentMember();
  const { initiativeId } = router.query;
  return useInitiative(
    currentMember?.path && initiativeId
      ? `${currentMember.path}/initiatives/${initiativeId}`
      : undefined
  );
};

export const useCurrentActions = () => {
  const appState = useAppState();
  const posiFormDataConverter = usePosiFormDataConverter();
  const [initiative] = useCurrentInitiative();
  return useCollectionData(
    initiative
      ? query(
          collection(appState.firestore, "actions"),
          where("initiativePath", "==", initiative.path)
        ).withConverter(posiFormDataConverter)
      : undefined
  );
};

export const useCurrentTestimonials = () => {
  const appState = useAppState();
  const [initiative] = useCurrentInitiative();
  const socialProofConverter = useSocialProofConverter();
  return useCollectionData(
    initiative
      ? query(
          collection(appState.firestore, "socialProofs"),
          where("forInitiative", "==", initiative.path)
        ).withConverter(socialProofConverter)
      : undefined
  );
};
