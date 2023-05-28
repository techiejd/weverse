import { useAuthState } from "react-firebase-hooks/auth";
import { AppState } from "./appState";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import {
  memberConverter,
  makerConverter,
  posiFormDataConverter,
  socialProofConverter,
} from "../utils/firebase";
import { useEffect, useState } from "react";

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

export const useMyMember = (appState: AppState) => {
  //TODO(techiejd): Go through codebase and replace with this.
  const [user, userLoading, userError] = useAuthState(appState.auth);
  return useDocumentData(
    user
      ? doc(appState.firestore, "members", user.uid).withConverter(
          memberConverter
        )
      : undefined
  );
};

export const useMyLikes = (appState: AppState) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [likesCollection, likesCollectionLoading, likesCollectionError] =
    useCollection(
      user
        ? collection(appState.firestore, "members", user.uid, "likes")
        : undefined
    );
  const [likes, setLikes] = useState<string[]>([]);
  useEffect(() => {
    if (likesCollection) {
      setLikes(likesCollection.docs.map((likeDoc) => likeDoc.id));
    }
  }, [likesCollection, setLikes]);

  return likes;
};

export const useLikesCount = (
  appState: AppState,
  actionId: string | undefined
) => {
  const [c, setC] = useState(0);
  useEffect(() => {
    (async () => {
      if (actionId) {
        setC(
          (
            await getCountFromServer(
              collection(appState.firestore, "impacts", actionId, "likes")
            )
          ).data().count
        );
      }
    })();
  }, [appState.firestore, actionId, setC]);

  return c;
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
