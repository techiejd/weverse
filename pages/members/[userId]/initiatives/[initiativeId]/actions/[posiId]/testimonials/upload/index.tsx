import { asOneWePage } from "../../../../../../../../../common/components/onewePage";
import UploadPrompt from "../../../../../../../../../common/components/testimonials/uploadPrompt";
import { CachePaths } from "../../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../../common/utils/translations";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = asOneWePage(() => {
  return <UploadPrompt />;
});

export default Upload;
