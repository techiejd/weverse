import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../modules/initiatives/context";
import Sponsor from "../../../modules/initiatives/sponsor";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { asOneWePage } from "../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const SponsorPage = asOneWePage(() => {
  const [maker] = useCurrentMaker();
  return maker ? (
    <Sponsor exitButtonBehavior={{ href: "/" }} beneficiary={maker} />
  ) : (
    <CircularProgress />
  );
});

export default SponsorPage;
