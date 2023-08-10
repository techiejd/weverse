import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../modules/makers/context";
import Sponsor from "../../../modules/makers/sponsor";
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
