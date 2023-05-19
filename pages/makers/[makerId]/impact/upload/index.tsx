import { CircularProgress } from "@mui/material";
import { AppState, useAppState } from "../../../../../common/context/appState";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import UploadSocialProofForm from "../../../../../common/components/uploadSocialProofForm";

const UploadPage = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return maker ? (
    <UploadSocialProofForm forMaker={maker} appState={appState} />
  ) : (
    <CircularProgress />
  );
};

const Upload = () => {
  const appState = useAppState();

  return appState ? <UploadPage appState={appState} /> : <CircularProgress />;
};

export default Upload;
