import { asOneWePage } from "../../../../../../../../../common/components/onewePage";
import UploadSocialProofForm from "../../../../../../../../../common/components/upload/form";
import { CachePaths } from "../../../../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../../../../common/utils/translations";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const UploadForm = asOneWePage(() => {
  return <UploadSocialProofForm />;
});

export default UploadForm;
