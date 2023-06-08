import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";

const UploadForm = () => {
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return maker ? (
    <UploadSocialProofForm forMaker={maker} />
  ) : (
    <CircularProgress />
  );
};

export default UploadForm;
