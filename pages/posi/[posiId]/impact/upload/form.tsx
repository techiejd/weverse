import { CircularProgress } from "@mui/material";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const UploadForm = asOneWePage(() => {
  const [action] = useCurrentPosi();
  const [maker] = useMaker(action?.makerId);
  return action && maker ? (
    <UploadSocialProofForm forMaker={maker} forAction={action} />
  ) : (
    <CircularProgress />
  );
});

export default UploadForm;
