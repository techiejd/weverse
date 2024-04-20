import { CircularProgress } from "@mui/material";
import { asOneWePage } from "../../../../../../../../common/components/onewePage";
import TestimonialsForm from "../../../../../../../../common/components/testimonials/form";
import {
  pathAndType2FromCollectionId,
  useCurrentTestimonial,
  useMyMember,
} from "../../../../../../../../common/context/weverseUtils";
import { CachePaths } from "../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const EditForm = asOneWePage(() => {
  const [forInitiative] = useCurrentInitiative();
  const [myMember] = useMyMember();
  const [testimonial] = useCurrentTestimonial(forInitiative?.path!);
  const fromPath =
    myMember?.path && testimonial?.path
      ? `${myMember?.path}/from/${pathAndType2FromCollectionId(
          testimonial.path,
          "testimonial"
        )}`
      : undefined;

  return testimonial && fromPath && testimonial.path ? (
    <TestimonialsForm
      onInteraction={{
        type: "update",
        path: testimonial.path,
        fromPath: fromPath,
      }}
      initialTestimonial={testimonial}
    />
  ) : (
    <CircularProgress />
  );
});

export default EditForm;
