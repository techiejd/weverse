import { useRouter } from "next/router";
import {
  useCurrentMember,
  useInitiative,
} from "../../common/context/weverseUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import {
  usePosiFormDataConverter,
  useSocialProofConverter,
  useSponsorshipConverter,
} from "../../common/utils/firebase";
import { useAppState } from "../../common/context/appState";
import { Initiative } from "../../functions/shared/src";
import { useCallback } from "react";

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

export const useCurrentSponsorships = () => {
  const appState = useAppState();
  const [initiative] = useCurrentInitiative();
  const sponsorshipConverter = useSponsorshipConverter();
  const [sponsorships, loading, error] = useCollectionData(
    initiative
      ? collection(
          appState.firestore,
          `${initiative.path}/sponsorships`
        ).withConverter(sponsorshipConverter)
      : undefined
  );
  return [sponsorships, loading, error] as const;
};

export const extractAccountLink = (
  connectedAccount: Initiative["connectedAccount"]
) =>
  connectedAccount
    ? `/${connectedAccount.ownerMemberPath}/accounts/${connectedAccount.stripeAccountId}`
    : "";

export const useAlertOrRedirectToOnboardingStripeAccount = () => {
  const router = useRouter();
  return useCallback(
    async (title: string, initiativePath: string, incubator?: string) => {
      if (!router.isReady) {
        alert(`Error creating new account: Router not ready`);
      }
      const newAccountResponse = await fetch("/api/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          initiativePath,
          incubator,
        }),
      });
      if (newAccountResponse.ok) {
        const newAccountLink = await newAccountResponse.json();
        router.push(newAccountLink.link);
      } else {
        alert(
          `Error creating new account ${newAccountResponse.status}: ${newAccountResponse.statusText}`
        );
      }
    },
    [router]
  );
};
