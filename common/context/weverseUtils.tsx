import { useAppState } from "./appState";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  collectionGroup,
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
  useFromConverter,
} from "../utils/firebase";
import { useEffect, useState } from "react";
import {
  organizationType,
  Initiative,
  OrganizationType,
  InitiativeType,
  initiativeType,
  FromType,
} from "../../functions/shared/src";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export const useInitiatives = (memberPath: string | undefined) => {
  const appState = useAppState();
  const initiativeConverter = useInitiativeConverter();
  return useCollectionData(
    memberPath
      ? collection(appState.firestore, memberPath, "initiatives").withConverter(
          initiativeConverter
        )
      : undefined
  );
};

export const useMyInitiatives = () => {
  const [myMember] = useMyMember();
  return useInitiatives(myMember?.path);
};

export const useMember = (memberPath: string | undefined) => {
  const appState = useAppState();
  const memberConverter = useMemberConverter();
  return useDocumentData(
    memberPath
      ? doc(appState.firestore, memberPath).withConverter(memberConverter)
      : undefined
  );
};

export const useMyMember = () => {
  const appState = useAppState();
  const { user } = appState.authState;
  return useMember(user ? `members/${user.uid}` : undefined);
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

export const useIsMine = () => {
  const [currentMember] = useCurrentMember();
  const [myMember] = useMyMember();
  return !!(
    currentMember &&
    myMember &&
    currentMember.path &&
    currentMember.path != "" &&
    currentMember.path == myMember.path
  );
};

export const useCurrentInitiatives = () => {
  const [currentMember] = useCurrentMember();
  return useInitiatives(currentMember?.path);
};

export const useCurrentSponsorships = () => {
  const router = useRouter();
  const appState = useAppState();
  const { initiativeId, userId: memberId } = router.query;
  const sponsorshipCollectionPath = memberId
    ? `members/${memberId}` +
      (initiativeId ? `/initiatives/${initiativeId}` : ``) +
      `/sponsorships`
    : undefined;
  const sponsorshipConverter = useSponsorshipConverter();

  const sponsorshipCollection = sponsorshipCollectionPath
    ? collection(appState.firestore, sponsorshipCollectionPath).withConverter(
        sponsorshipConverter
      )
    : undefined;
  return useCollectionData(sponsorshipCollection);
};

export const useMySponsorships = () => {
  const appState = useAppState();
  const [myMember] = useMyMember();
  const sponsorshipConverter = useSponsorshipConverter();
  return useCollectionData(
    myMember && myMember.path
      ? collection(
          appState.firestore,
          myMember.path,
          "sponsorships"
        ).withConverter(sponsorshipConverter)
      : undefined
  );
};

export const pathAndType2FromCollectionId = (
  path: string | undefined,
  fromType: FromType
) => {
  // if path is undefined, return undefined
  // if path exists, return the path with all slashes replaced with underscores and prepended with fromType
  if (!path) return undefined;
  return `${fromType}_${path.replaceAll("/", "_")}`;
};

const fromCollectionId2PathAndType = (fromId: string | undefined) => {
  // if fromId is undefined, return undefined
  // if fromId exists, return the path and fromType
  if (!fromId) return undefined;
  const fromType = fromId.split("_")[0] as FromType;
  const path = fromId.slice(fromType.length + 1).replaceAll("_", "/");
  return { path, fromType };
};

export const useMyLikes = () => {
  // Returns a list of the paths of the actions that the current user has liked.
  const [myMember] = useMyMember();
  const appState = useAppState();
  const fromConverter = useFromConverter();
  const [fromCollection] = useCollection(
    myMember
      ? collection(appState.firestore, myMember.path!, "from").withConverter(
          fromConverter
        )
      : undefined
  );
  return fromCollection?.docs
    .filter((doc) => doc.data().type == "like")
    .map((doc) => fromCollectionId2PathAndType(doc.id)?.path);
};

export const useLikesCount = (actionPath: string | undefined) => {
  // Does not update when likes are added or removed. Only when the component is mounted.
  const appState = useAppState();
  const [c, setC] = useState(0);
  useEffect(() => {
    (async () => {
      if (actionPath) {
        setC(
          (
            await getCountFromServer(
              collection(appState.firestore, actionPath, "likes")
            )
          ).data().count
        );
      }
    })();
  }, [appState.firestore, actionPath, setC]);

  return c;
};

export const useInitiative = (initiativePath: string | undefined) => {
  const appState = useAppState();
  const initiativeConverter = useInitiativeConverter();
  return useDocumentData(
    initiativePath
      ? doc(appState.firestore, initiativePath).withConverter(
          initiativeConverter
        )
      : undefined
  );
};

export const useAction = (posiPath: string | undefined) => {
  const appState = useAppState();
  const posiFormDataConverter = usePosiFormDataConverter();
  return useDocumentData(
    posiPath
      ? doc(appState.firestore, posiPath).withConverter(posiFormDataConverter)
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

export const useActions = (initiativePath: string | undefined) => {
  const appState = useAppState();
  const posiFormDataConverter = usePosiFormDataConverter();
  return useCollectionData(
    initiativePath
      ? query(
          collectionGroup(appState.firestore, "actions").withConverter(
            posiFormDataConverter
          ),
          where("initiativePath", "==", initiativePath)
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
  const { initiativeId, userId: memberId } = router.query;
  const incubateeConverter = useIncubateeConverter();
  return useCollectionData(
    initiativeId
      ? collection(
          appState.firestore,
          "members",
          memberId as string,
          "initiatives",
          initiativeId as string,
          "incubatees"
        ).withConverter(incubateeConverter)
      : undefined
  );
};

export const useCurrentNeedsValidation = () => {
  const router = useRouter();
  const appState = useAppState();
  const { initiativeId, userId: memberId } = router.query;
  const posiFormDataConverter = usePosiFormDataConverter();
  const path = "members/" + memberId + "/initiatives/" + initiativeId;
  return useCollectionData(
    initiativeId && initiativeId != ""
      ? query(
          collection(appState.firestore, "actions").withConverter(
            posiFormDataConverter
          ),
          where("validation.validator", "==", path),
          where("validation.validated", "==", false)
        )
      : undefined
  );
};
