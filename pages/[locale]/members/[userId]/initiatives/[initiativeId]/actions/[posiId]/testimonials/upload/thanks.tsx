import { asOneWePage } from "../../../../../../../../../../common/components/onewePage";
import ThanksForTestimonial from "../../../../../../../../../../common/components/thanksForTestimonial";
import { CachePaths } from "../../../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../../../common/utils/translations";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Thanks = asOneWePage(() => {
  return <ThanksForTestimonial />;
});

export default Thanks;
