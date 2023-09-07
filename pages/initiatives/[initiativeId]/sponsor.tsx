import { CircularProgress } from "@mui/material";
import { useCurrentInitiative } from "../../../modules/initiatives/context";
import Sponsor from "../../../modules/initiatives/sponsor";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { asOneWePage } from "../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const SponsorPage = asOneWePage(() => {
  const [initiative] = useCurrentInitiative();
  return initiative ? (
    <Sponsor exitButtonBehavior={{ href: "/" }} beneficiary={initiative} />
  ) : (
    <CircularProgress />
  );
});

export default SponsorPage;
