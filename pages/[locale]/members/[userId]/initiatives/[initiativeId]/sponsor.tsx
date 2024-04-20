import { CircularProgress } from "@mui/material";
import { asOneWePage } from "../../../../../../common/components/onewePage";
import { CachePaths } from "../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../modules/initiatives/context";
import Sponsor from "../../../../../../modules/initiatives/sponsor";

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
