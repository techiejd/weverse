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
      ? collection(
          appState.firestore,
          `${initiative.path}/actions`
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
      ? collection(
          appState.firestore,
          `${initiative.path}/testimonials`
        ).withConverter(socialProofConverter)
      : undefined
  );
};
