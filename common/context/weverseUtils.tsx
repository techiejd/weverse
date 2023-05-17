import { useAuthState } from "react-firebase-hooks/auth";
import { AppState } from "./appState";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import {
  memberConverter,
  makerConverter,
  posiFormDataConverter,
} from "../utils/firebase";

export const useMyMaker = (appState: AppState) => {
  //TODO(techiejd): Go through codebase and replace with this.
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [member, memberLoading, memberError] = useDocumentData(
    user
      ? doc(appState.firestore, "members", user.uid).withConverter(
          memberConverter
        )
      : undefined
  );
  return useDocumentData(
    member && member.makerId
      ? doc(appState.firestore, "makers", member.makerId).withConverter(
          makerConverter
        )
      : undefined
  );
};

export const useMaker = (appState: AppState, makerId: string | undefined) => {
  //TODO(techiejd): Go through codebase and replace with this.
  return useDocumentData(
    makerId
      ? doc(appState.firestore, "makers", makerId).withConverter(makerConverter)
      : undefined
  );
};

export const useAction = (appState: AppState, posiId: string | undefined) => {
  //TODO(techiejd): Go through codebase and replace with this.
  return useDocumentData(
    posiId
      ? doc(appState.firestore, "impacts", posiId).withConverter(
          posiFormDataConverter
        )
      : undefined
  );
};
