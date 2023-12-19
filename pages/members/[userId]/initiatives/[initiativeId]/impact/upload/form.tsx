import { CircularProgress } from "@mui/material";
import { asOneWePage } from "../../../../../../../common/components/onewePage";
import UploadSocialProofForm from "../../../../../../../common/components/upload/form";
import { CachePaths } from "../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const UploadForm = asOneWePage(() => {
  const [initiative] = useCurrentInitiative();
  return initiative ? <UploadSocialProofForm /> : <CircularProgress />;
});

export default UploadForm;
