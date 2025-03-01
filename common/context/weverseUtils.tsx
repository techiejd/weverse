import { useAppState } from "./appState";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  QueryDocumentSnapshot,
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
  From,
  SocialProof,
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

export const pathAndType2FromCollectionId = (
  path: string | undefined,
  fromType: FromType
) => {
  const pathUniquenessDisrespected = (path: string, fromType: FromType) => {
    const fromTypeUnique: Record<FromType, boolean> = {
      testimonial: false,
      sponsorship: true,
      like: true,
    };
    if (fromTypeUnique[fromType]) {
      // Respecting uniqueness would not include the formtype in path.
      // As the path should be "parent/path" in order to keep uniqueness.
      return path.includes(fromType);
    } else {
      // Respecting non-uniqueness would include the formtype in path.
      // As the path should be "parent/path/fromType/uuid" in order to allow
      // multiple of formType.
      return !path.includes(fromType);
    }
  };

  // if path is undefined, return undefined
  if (!path) return undefined;
  // if path exists, raise error if the path includes
  // the fromType when it is unique.
  if (pathUniquenessDisrespected(path, fromType)) {
    throw new Error(
      `Path ${path} disrespects fromType ${fromType}'s uniqueness.`
    );
  }
  // return the path with all slashes replaced with underscores and prepended with fromType
  return `${fromType}_${path.replaceAll("/", "_")}`;
};

// Note: It is up to the caller to ensure that the path is valid, processed and consumed correctly.
export const fromCollectionId2PathAndType = (fromId: string | undefined) => {
  // if fromId is undefined, return undefined
  // if fromId exists, return the path and fromType
  if (!fromId) return undefined;
  const fromType = fromId.split("_")[0] as FromType;
  const path = fromId.slice(fromType.length + 1).replaceAll("_", "/");
  return { path, fromType };
};

export const useFilteredFromCollection = (
  path: string | undefined,
  type: FromType
) => {
  const appState = useAppState();
  const fromConverter = useFromConverter();
  const [fromCollection, fromCollectionLoading, fromCollectionError] =
    useCollection(
      path
        ? collection(appState.firestore, path, "from").withConverter(
            fromConverter
          )
        : undefined
    );
  return [
    fromCollection?.docs.filter((doc) => doc.data().type == type),
    fromCollectionLoading,
    fromCollectionError,
  ] as const;
};

export const useMyLikes = () => {
  // Returns a list of the paths of the actions that the current signed in member has liked.
  const [myMember] = useMyMember();
  const [likes, likesLoading, likesError] = useFilteredFromCollection(
    myMember?.path,
    "like"
  );
  return [
    likes?.map((doc) => fromCollectionId2PathAndType(doc.id)?.path),
    likesLoading,
    likesError,
  ] as const;
};

const sortFromByDate = (
  a: QueryDocumentSnapshot<From>,
  b: QueryDocumentSnapshot<From>
) => {
  // Look if the createdAt doesn't exist it's because it hasn't hit the server
  // yet. So we use the current time.
  const aCreatedAt = a.data().createdAt || new Date();
  const bCreatedAt = b.data().createdAt || new Date();
  return bCreatedAt.getTime() - aCreatedAt.getTime();
};

export const useCurrentLikes = () => {
  // Returns a list of the paths of the actions that the member in context has liked.
  const [currentMember] = useCurrentMember();
  const [likes, likesLoading, likesError] = useFilteredFromCollection(
    currentMember?.path,
    "like"
  );
  return [
    likes
      ?.sort(sortFromByDate)
      .map((doc) => fromCollectionId2PathAndType(doc.id)?.path),
    likesLoading,
    likesError,
  ] as [string[] | undefined, boolean, Error | undefined];
};

export const useCurrentTestimonials = () => {
  // Returns a list of the testimonials of the actions that the member in context has done in desc order.
  const [currentMember] = useCurrentMember();
  const [testimonials, testimonialsLoading, testimonialsError] =
    useFilteredFromCollection(currentMember?.path, "testimonial");
  return [
    testimonials?.sort(sortFromByDate),
    testimonialsLoading,
    testimonialsError,
  ] as [
    (
      | QueryDocumentSnapshot<{ type: "testimonial"; data: SocialProof }>[]
      | undefined
    ),
    boolean,
    Error | undefined
  ];
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
          collectionGroup(appState.firestore, "actions").withConverter(
            posiFormDataConverter
          ),
          where("validation.validator", "==", path),
          where("validation.validated", "==", false)
        )
      : undefined
  );
};

export const useCurrentTestimonial = (parentPath: string | undefined) => {
  // TODO(techiejd): Now that initiatives and testimonials have been nested, we can
  // remove the posi context.
  const appState = useAppState();
  const socialProofConverter = useSocialProofConverter();
  const router = useRouter();
  const { testimonialId } = router.query;

  return useDocumentData(
    testimonialId && parentPath
      ? doc(
          appState.firestore,
          parentPath,
          "testimonials",
          testimonialId as string
        ).withConverter(socialProofConverter)
      : undefined
  );
};
