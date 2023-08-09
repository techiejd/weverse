import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import ThanksForTestimonial from "../../../../../common/components/thanksForTestimonial";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Thanks = () => {
  const [maker] = useCurrentMaker();
  return ThanksForTestimonial({ forMakerId: maker?.id });
};

export default Thanks;
