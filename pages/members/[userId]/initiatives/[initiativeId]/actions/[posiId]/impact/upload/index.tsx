import { asOneWePage } from "../../../../../../../../../common/components/onewePage";
import UploadSocialProofPrompt from "../../../../../../../../../common/components/upload/prompt";
import { CachePaths } from "../../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../../common/utils/translations";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = asOneWePage(() => {
  return <UploadSocialProofPrompt />;
});

export default Upload;
