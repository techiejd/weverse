import { CircularProgress } from "@mui/material";
import { asOneWePage } from "../../../../../../../common/components/onewePage";
import TestimonialsForm from "../../../../../../../common/components/testimonials/form";
import { useMyMember } from "../../../../../../../common/context/weverseUtils";
import { CachePaths } from "../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const UploadForm = asOneWePage(() => {
  const [forInitiative] = useCurrentInitiative();
  const [myMember] = useMyMember();

  return myMember && forInitiative && forInitiative.path ? (
    <TestimonialsForm
      onInteraction={{ type: "create", parentPath: forInitiative.path }}
      initialTestimonial={{
        rating: null,
        byMember: myMember.path!,
        forInitiative: forInitiative.path!,
      }}
    />
  ) : (
    <CircularProgress />
  );
});

export default UploadForm;
