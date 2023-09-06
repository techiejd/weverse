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
  useMemberConverter,
  useMakerConverter,
  usePosiFormDataConverter,
  useSocialProofConverter,
  useSponsorshipConverter,
  useIncubateeConverter,
} from "../utils/firebase";
import { useEffect, useState } from "react";
import {
  organizationType,
  makerType,
  Maker,
  OrganizationType,
  MakerType,
} from "../../functions/shared/src";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export const useMyMaker = () => {
  const appState = useAppState();
  const { user } = appState.authState;
  const memberConverter = useMemberConverter();
  const makerConverter = useMakerConverter();
  const [member] = useDocumentData(
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
  const memberConverter = useMemberConverter();
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
  const memberConverter = useMemberConverter();
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
  const memberConverter = useMemberConverter();
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
  const memberConverter = useMemberConverter();
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
  const { initiativeId, userId: memberId } = router.query;
  const id = (initiativeId ? initiativeId : memberId) as string;
  const sponsorshipConverter = useSponsorshipConverter();

  const sponsorshipCollection =
    initiativeId || memberId
      ? collection(
          appState.firestore,
          initiativeId ? "makers" : "members",
          id,
          "sponsorships"
        ).withConverter(sponsorshipConverter)
      : undefined;

  return useCollectionData(sponsorshipCollection);
};

export const useMySponsorships = () => {
  const appState = useAppState();
  const [myMember] = useMyMember();
  const sponsorshipConverter = useSponsorshipConverter();
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
  const makerConverter = useMakerConverter();
  return useDocumentData(
    makerId
      ? doc(appState.firestore, "makers", makerId).withConverter(makerConverter)
      : undefined
  );
};

export const useAction = (posiId: string | undefined) => {
  const appState = useAppState();
  const posiFormDataConverter = usePosiFormDataConverter();
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
  const socialProofConverter = useSocialProofConverter();
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
  const posiFormDataConverter = usePosiFormDataConverter();
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

export const useMakerTypeLabel = (maker?: Maker) => {
  const makerTypesTranslations = useTranslations("makers.types.short");
  if (!maker) {
    return "";
  }
  const organizationLabels = Object.keys(organizationType.Enum).reduce(
    (acc, key) => {
      acc[key as OrganizationType] = makerTypesTranslations(key);
      return acc;
    },
    {} as Record<OrganizationType, string>
  );

  const makerTypeLabels = Object.keys(makerType.Enum).reduce((acc, key) => {
    acc[key as MakerType] = makerTypesTranslations(key);
    return acc;
  }, {} as Record<MakerType, string>);

  return maker.type == "individual"
    ? makerTypeLabels[maker.type]
    : maker.organizationType
    ? organizationLabels[maker.organizationType]
    : makerTypeLabels[maker.type];
};

export const useCurrentIncubatees = () => {
  const router = useRouter();
  const appState = useAppState();
  const { initiativeId } = router.query;
  const incubateeConverter = useIncubateeConverter();
  return useCollectionData(
    initiativeId
      ? collection(
          appState.firestore,
          "makers",
          initiativeId as string,
          "incubatees"
        ).withConverter(incubateeConverter)
      : undefined
  );
};

export const useCurrentNeedsValidation = () => {
  const router = useRouter();
  const appState = useAppState();
  const { initiativeId } = router.query;
  const posiFormDataConverter = usePosiFormDataConverter();
  return useCollectionData(
    initiativeId && initiativeId != ""
      ? query(
          collection(appState.firestore, "impacts").withConverter(
            posiFormDataConverter
          ),
          where("validation.validator", "==", initiativeId),
          where("validation.validated", "==", false)
        )
      : undefined
  );
};
