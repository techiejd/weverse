import { useAppState } from "./appState";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
  useDocumentDataOnce,
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
  sponsorshipConverter,
} from "../utils/firebase";
import { useEffect, useState } from "react";
import { organizationType, makerType, Maker } from "../../functions/shared/src";
import { useRouter } from "next/router";

export const useMyMaker = () => {
  const appState = useAppState();
  const { user } = appState.authState;
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

export const useMember = (memberId: string | undefined) => {
  const appState = useAppState();
  return useDocumentData(
    memberId
      ? doc(appState.firestore, "members", memberId).withConverter(
          memberConverter
        )
      : undefined
  );
};

export const useMyMember = () => {
  const appState = useAppState();
  const { user } = appState.authState;
  return useDocumentData(
    user
      ? doc(appState.firestore, "members", user.uid).withConverter(
          memberConverter
        )
      : undefined
  );
};

export const useCurrentMember = () => {
  const router = useRouter();
  const appState = useAppState();
  const { userId: memberId } = router.query;
  return useDocumentData(
    memberId
      ? doc(appState.firestore, "members", memberId as string).withConverter(
          memberConverter
        )
      : undefined
  );
};

export const useMyMemberOnce = () => {
  const appState = useAppState();
  const { user } = appState.authState;
  return useDocumentDataOnce(
    user
      ? doc(appState.firestore, "members", user.uid).withConverter(
          memberConverter
        )
      : undefined
  );
};

export const useCurrentSponsorships = () => {
  const router = useRouter();
  const appState = useAppState();
  const { makerId, userId: memberId } = router.query;
  const id = (makerId ? makerId : memberId) as string;
  const subscriptionsType = makerId ? "for" : "from";

  const sponsorshipCollection =
    makerId || memberId
      ? collection(
          appState.firestore,
          makerId ? "makers" : "members",
          id,
          "sponsorships"
        ).withConverter(sponsorshipConverter)
      : undefined;

  return useCollectionData(sponsorshipCollection);
};

export const useMySponsorships = () => {
  const appState = useAppState();
  const [myMember] = useMyMember();
  return useCollectionData(
    myMember && myMember.id && myMember.id != ""
      ? collection(
          appState.firestore,
          "members",
          myMember.id,
          "sponsorships"
        ).withConverter(sponsorshipConverter)
      : undefined
  );
};

export const useMyLikes = () => {
  const appState = useAppState();
  const { user } = useAppState().authState;
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

export const useLikesCount = (actionId: string | undefined) => {
  const appState = useAppState();
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

export const useMaker = (makerId: string | undefined) => {
  const appState = useAppState();
  return useDocumentData(
    makerId
      ? doc(appState.firestore, "makers", makerId).withConverter(makerConverter)
      : undefined
  );
};

export const useAction = (posiId: string | undefined) => {
  const appState = useAppState();
  return useDocumentData(
    posiId
      ? doc(appState.firestore, "impacts", posiId).withConverter(
          posiFormDataConverter
        )
      : undefined
  );
};

export const useSocialProofs = (
  beneficiary: string | undefined,
  beneficiaryType: "action" | "maker"
) => {
  const appState = useAppState();
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

export const useActions = (maker: string | undefined) => {
  const appState = useAppState();
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

export const getMakerTypeLabel = (maker: Maker) => {
  const organizationLabels = {
    [organizationType.Enum.nonprofit]: "ONG",
    [organizationType.Enum.religious]: "Congregación",
    [organizationType.Enum.unincorporated]: "Voluntarios",
    [organizationType.Enum.profit]: "Comercial",
    [organizationType.Enum.incubator]: "Incubadora",
  };

  const makerTypeLabels = {
    [makerType.Enum.individual]: "Individuo",
    [makerType.Enum.organization]: "Organización",
  };
  return maker.type == "individual"
    ? makerTypeLabels[maker.type]
    : maker.organizationType
    ? organizationLabels[maker.organizationType]
    : makerTypeLabels[maker.type];
};
