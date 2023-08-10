import { useCurrentMaker } from "../../../../../modules/makers/context";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import ThanksForTestimonial from "../../../../../common/components/thanksForTestimonial";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Thanks = asOneWePage(() => {
  const [maker] = useCurrentMaker();
  return ThanksForTestimonial({ forMakerId: maker?.id });
});

export default Thanks;
