import { useCurrentInitiative } from "../../../../../modules/initiatives/context";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import ThanksForTestimonial from "../../../../../common/components/thanksForTestimonial";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Thanks = asOneWePage(() => {
  const [initiative] = useCurrentInitiative();
  return ThanksForTestimonial({ forInitiativeId: initiative?.id });
});

export default Thanks;
