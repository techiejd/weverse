import { CircularProgress } from "@mui/material";
import { useInitiative } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofPrompt from "../../../../../common/components/upload/prompt";
import { WithTranslationsStaticProps } from "../../../../../common/utils/translations";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Upload = asOneWePage(() => {
  const [action] = useCurrentPosi();
  const [initiative] = useInitiative(action?.initiativeId);
  return action && initiative ? (
    <UploadSocialProofPrompt forInitiative={initiative} forAction={action} />
  ) : (
    <CircularProgress />
  );
});

export default Upload;
