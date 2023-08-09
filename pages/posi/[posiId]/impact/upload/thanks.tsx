import { CircularProgress } from "@mui/material";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import ThanksForTestimonial from "../../../../../common/components/thanksForTestimonial";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Thanks = () => {
  const [action] = useCurrentPosi();
  return ThanksForTestimonial({
    forMakerId: action?.makerId,
    forActionId: action?.id,
  });
};

export default Thanks;
