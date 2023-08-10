import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const UploadForm = asOneWePage(() => {
  const [maker] = useCurrentMaker();
  return maker ? (
    <UploadSocialProofForm forMaker={maker} />
  ) : (
    <CircularProgress />
  );
});

export default UploadForm;
