import { CircularProgress } from "@mui/material";
import { AppState, useAppState } from "../../../../../common/context/appState";
import { useMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";

const UploadFormPage = ({ appState }: { appState: AppState }) => {
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

const UploadForm = () => {
  const appState = useAppState();

  return appState ? (
    <UploadFormPage appState={appState} />
  ) : (
    <CircularProgress />
  );
};

export default UploadForm;
