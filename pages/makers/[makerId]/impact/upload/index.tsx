import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofPrompt from "../../../../../common/components/upload/prompt";

const Upload = () => {
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return maker ? (
    <UploadSocialProofPrompt forMaker={maker} />
  ) : (
    <CircularProgress />
  );
};

export default Upload;
