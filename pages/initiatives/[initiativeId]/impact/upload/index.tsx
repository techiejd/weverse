import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/initiatives/context";
import UploadSocialProofPrompt from "../../../../../common/components/upload/prompt";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = asOneWePage(() => {
  const [maker] = useCurrentMaker();
  return maker ? (
    <UploadSocialProofPrompt forMaker={maker} />
  ) : (
    <CircularProgress />
  );
});

export default Upload;
