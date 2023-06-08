import { CircularProgress } from "@mui/material";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";

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
