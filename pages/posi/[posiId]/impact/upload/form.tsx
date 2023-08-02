import { CircularProgress } from "@mui/material";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const UploadForm = () => {
  const [action, actionLoading, actionError] = useCurrentPosi();
  const [maker, makerLoading, makerError] = useMaker(action?.makerId);
  return action && maker ? (
    <UploadSocialProofForm forMaker={maker} forAction={action} />
  ) : (
    <CircularProgress />
  );
};

export default UploadForm;
