import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const UploadForm = () => {
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return maker ? (
    <UploadSocialProofForm forMaker={maker} />
  ) : (
    <CircularProgress />
  );
};

export default UploadForm;
