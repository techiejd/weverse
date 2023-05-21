import { useAuthState } from "react-firebase-hooks/auth";
import { AppState } from "./appState";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { collection, doc, query, where } from "firebase/firestore";
import {
  memberConverter,
  makerConverter,
  posiFormDataConverter,
  socialProofConverter,
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

export const useSocialProofs = (
  appState: AppState,
  beneficiary: string | undefined,
  beneficiaryType: "action" | "maker"
) => {
  return useCollectionData(
    beneficiary
      ? query(
          collection(appState.firestore, "socialProofs").withConverter(
            socialProofConverter
          ),
          where(
            beneficiaryType == "action" ? "forAction" : "forMaker",
            "==",
            beneficiary
          )
        )
      : undefined
  );
};

export const useActions = (appState: AppState, maker: string | undefined) => {
  return useCollectionData(
    maker
      ? query(
          collection(appState.firestore, "impacts").withConverter(
            posiFormDataConverter
          ),
          where("makerId", "==", maker)
        )
      : undefined
  );
};
