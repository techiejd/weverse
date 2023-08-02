import { CircularProgress } from "@mui/material";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofPrompt from "../../../../../common/components/upload/prompt";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = () => {
  const [action, actionLoading, actionError] = useCurrentPosi();
  const [maker, makerLoading, makerError] = useMaker(action?.makerId);
  return action && maker ? (
    <UploadSocialProofPrompt forMaker={maker} forAction={action} />
  ) : (
    <CircularProgress />
  );
};

export default Upload;
