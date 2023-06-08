import { CircularProgress } from "@mui/material";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofPrompt from "../../../../../common/components/upload/prompt";

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
