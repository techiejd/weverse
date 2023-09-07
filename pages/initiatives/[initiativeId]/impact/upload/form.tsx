import { CircularProgress } from "@mui/material";
import { useCurrentInitiative } from "../../../../../modules/initiatives/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const UploadForm = asOneWePage(() => {
  const [initiative] = useCurrentInitiative();
  return initiative ? (
    <UploadSocialProofForm forInitiative={initiative} />
  ) : (
    <CircularProgress />
  );
});

export default UploadForm;
