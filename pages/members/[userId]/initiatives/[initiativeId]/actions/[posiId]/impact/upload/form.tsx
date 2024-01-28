import { CircularProgress } from "@mui/material";
import { asOneWePage } from "../../../../../../../../../common/components/onewePage";
import UploadSocialProofForm from "../../../../../../../../../common/components/upload/form";
import { useMyMember } from "../../../../../../../../../common/context/weverseUtils";
import { CachePaths } from "../../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../../../../modules/initiatives/context";
import { useCurrentPosi } from "../../../../../../../../../modules/posi/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const UploadForm = asOneWePage(() => {
  const [forInitiative] = useCurrentInitiative();
  const [forAction] = useCurrentPosi();
  const [myMember] = useMyMember();
  return myMember && forInitiative && forAction && forAction.path ? (
    <UploadSocialProofForm
      onInteraction={{ type: "create", parentPath: forAction.path }}
      initialTestimonial={{
        rating: null,
        byMember: myMember.path!,
        forInitiative: forInitiative.path!,
        forAction: forAction.path!,
      }}
    />
  ) : (
    <CircularProgress />
  );
});

export default UploadForm;
