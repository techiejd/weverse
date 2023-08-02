import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofPrompt from "../../../../../common/components/upload/prompt";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = () => {
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return maker ? (
    <UploadSocialProofPrompt forMaker={maker} />
  ) : (
    <CircularProgress />
  );
};

export default Upload;
