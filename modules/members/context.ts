import {
  useCurrentMember,
  useFilteredFromCollection,
  useMyMember,
} from "../../common/context/weverseUtils";
import { Sponsorship } from "../../functions/shared/src";

const useSponsorships = (path: string | undefined) => {
  const [sponsorships, sponsorshipsLoading, sponsorshipsError] =
    useFilteredFromCollection(path, "sponsorship");
  return [
    sponsorships?.map(
      (sponsorshipFromDatum) => sponsorshipFromDatum.data().data as Sponsorship
    ),
    sponsorshipsLoading,
    sponsorshipsError,
  ] as const;
};

export const useCurrentSponsorships = () => {
  const [currentMember] = useCurrentMember();
  return useSponsorships(currentMember?.path);
};

export const useMySponsorships = () => {
  const [myMember] = useMyMember();
  return useSponsorships(myMember?.path);
};
