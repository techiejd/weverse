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
  useInitiativeConverter,
  usePosiFormDataConverter,
  useSocialProofConverter,
  useSponsorshipConverter,
  useIncubateeConverter,
} from "../utils/firebase";
import { useEffect, useState } from "react";
import {
  organizationType,
  Maker as Initiative,
  OrganizationType,
  MakerType as InitiativeType,
  makerType as initiativeType,
} from "../../functions/shared/src";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export const useMyInitiative = () => {
  const appState = useAppState();
  const { user } = appState.authState;
  const memberConverter = useMemberConverter();
  const initiativeConverter = useInitiativeConverter();
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
          initiativeConverter
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

export const useInitiative = (initiativeId: string | undefined) => {
  const appState = useAppState();
  const initiativeConverter = useInitiativeConverter();
  return useDocumentData(
    initiativeId
      ? doc(appState.firestore, "makers", initiativeId).withConverter(
          initiativeConverter
        )
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
  beneficiaryType: "action" | "initiative"
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
            beneficiaryType == "action" ? "forAction" : "forInitiative",
            "==",
            beneficiary
          )
        )
      : undefined
  );
};

export const useActions = (initiative: string | undefined) => {
  const appState = useAppState();
  const posiFormDataConverter = usePosiFormDataConverter();
  return useCollectionData(
    initiative
      ? query(
          collection(appState.firestore, "impacts").withConverter(
            posiFormDataConverter
          ),
          where("initiativeId", "==", initiative)
        )
      : undefined
  );
};

export const useInitiativeTypeLabel = (initiative?: Initiative) => {
  const initiativeTypesTranslations = useTranslations(
    "initiatives.types.short"
  );
  if (!initiative) {
    return "";
  }
  const organizationLabels = Object.keys(organizationType.Enum).reduce(
    (acc, key) => {
      acc[key as OrganizationType] = initiativeTypesTranslations(key);
      return acc;
    },
    {} as Record<OrganizationType, string>
  );

  const initiativeTypeLabels = Object.keys(initiativeType.Enum).reduce(
    (acc, key) => {
      acc[key as InitiativeType] = initiativeTypesTranslations(key);
      return acc;
    },
    {} as Record<InitiativeType, string>
  );

  return initiative.type == "individual"
    ? initiativeTypeLabels[initiative.type]
    : initiative.organizationType
    ? organizationLabels[initiative.organizationType]
    : initiativeTypeLabels[initiative.type];
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
