import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { AppState, useAppState } from "../../common/context/appState";
import { Box, CircularProgress, Fab, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MakerCard from "../../modules/makers/MakerCard";
import { makerConverter } from "../../common/context/weverse";
import PageTitle from "../../common/components/pageTitle";
import { PlusOne } from "@mui/icons-material";
import AuthDialog from "../../modules/auth/AuthDialog";
import { useAuthState } from "react-firebase-hooks/auth";

const MyMakerPortal = ({ appState }: { appState: AppState }) => {
  const [user, loading, error] = useAuthState(appState.auth);
};

const MakersListed = ({ appState }: { appState: AppState }) => {
  const [makersSnapshot, makersLoading, makersError] = useCollection(
    collection(appState.firestore, "makers").withConverter(makerConverter)
  );
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  //

  const [makers, setMakers] = useState<string[]>([]);

  const Loading = () => {
    return (
      <Box>
        <Typography>Makers: Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  };

  useEffect(() => {
    makersSnapshot?.docChanges().forEach((docChange) => {
      // TODO(techiejd): Look into the other scenarios.
      if (docChange.type == "added") {
        setMakers((makers) => [...makers, docChange.doc.id]);
      }
    });
  }, [makersSnapshot]);
  return (
    <Box>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", p: 1 }}
        spacing={1}
      >
        <PageTitle title={<b>💪 Makers</b>} />
        {makersError && (
          <Typography color={"red"}>
            Error: {JSON.stringify(makersError)}
          </Typography>
        )}
        {makersLoading && <Loading />}
        {makers.map((maker) => (
          <MakerCard makerId={maker} key={maker} />
        ))}
      </Stack>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        color="primary"
        onClick={() => {
          setAuthDialogOpen(true);
        }}
      >
        <PlusOne sx={{ mr: 1 }} />
        <Typography>¡Sumáte!</Typography>
      </Fab>
    </Box>
  );
};

const Makers = () => {
  const appState = useAppState();
  return appState ? <MakersListed appState={appState} /> : <CircularProgress />;
};

export default Makers;
