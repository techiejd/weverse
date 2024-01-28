import { CircularProgress } from "@mui/material";
import { asOneWePage } from "../../../../../../../common/components/onewePage";
import UploadPrompt from "../../../../../../../common/components/testimonials/uploadPrompt";
import { CachePaths } from "../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = asOneWePage(() => {
  const [initiative] = useCurrentInitiative();
  return initiative ? <UploadPrompt /> : <CircularProgress />;
});

export default Upload;
