import { CircularProgress } from "@mui/material";
import { AppState, useAppState } from "../../../../../common/context/appState";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofForm from "../../../../../common/components/uploadSocialProofForm";

const UploadPage = ({ appState }: { appState: AppState }) => {
  const [action, actionLoading, actionError] = useCurrentPosi(appState);
  const [maker, makerLoading, makerError] = useMaker(appState, action?.makerId);
  return action && maker ? (
    <UploadSocialProofForm
      forMaker={maker}
      forAction={action}
      appState={appState}
    />
  ) : (
    <CircularProgress />
  );
};

const Upload = () => {
  const appState = useAppState();

  return appState ? <UploadPage appState={appState} /> : <CircularProgress />;
};

export default Upload;
