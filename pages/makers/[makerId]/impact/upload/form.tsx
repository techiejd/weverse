import { CircularProgress } from "@mui/material";
import { AppState, useAppState } from "../../../../../common/context/appState";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofForm from "../../../../../common/components/upload/form";

const UploadFormPage = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return maker ? (
    <UploadSocialProofForm forMaker={maker} appState={appState} />
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
