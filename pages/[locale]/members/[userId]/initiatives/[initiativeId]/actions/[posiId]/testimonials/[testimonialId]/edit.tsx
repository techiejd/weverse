import { CircularProgress } from "@mui/material";
import { useCurrentPosiPath } from "../../../../../../../../../../modules/posi/context";
import { asOneWePage } from "../../../../../../../../../../common/components/onewePage";
import TestimonialsForm from "../../../../../../../../../../common/components/testimonials/form";
import {
  useMyMember,
  useCurrentTestimonial,
  pathAndType2FromCollectionId,
} from "../../../../../../../../../../common/context/weverseUtils";
import { CachePaths } from "../../../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../../../common/utils/translations";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const EditForm = asOneWePage(() => {
  const forActionPath = useCurrentPosiPath();
  const [myMember] = useMyMember();
  const [testimonial] = useCurrentTestimonial(forActionPath);
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
