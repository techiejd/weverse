import { useAuthState } from "react-firebase-hooks/auth";
import { AppState, useAppState } from "./appState";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { makerConverter, memberConverter } from "./weverse";

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
    member
      ? doc(appState.firestore, "makers", member.makerId).withConverter(
          makerConverter
        )
      : undefined
  );
};

export const useMaker = (appState: AppState, makerId: string) => {
  //TODO(techiejd): Go through codebase and replace with this.
  return useDocumentData(
    doc(appState.firestore, "makers", makerId).withConverter(makerConverter)
  );
};
