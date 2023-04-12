import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import {
  PosiFormData,
  posiFormDataConverter,
} from "../../modules/posi/input/context";
import { collection, CollectionReference } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { PlusOne } from "@mui/icons-material";
import ImpactsList from "../../modules/posi/impactsList";

const Index = () => {
  const appState = useAppState();

  const query = appState
    ? collection(appState.firestore, "impacts").withConverter(
        posiFormDataConverter
      )
    : undefined;

  return (
    <Box mb={9} /** For the fab icon space. */>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h1" justifyContent={"center"}>
          📺 <b>We</b>Screen
        </Typography>
      </Box>

      {query == undefined ? (
        <CircularProgress />
      ) : (
        <ImpactsList
          impactsQuery={
            // TODO(techiejd: Look into this casting why necessary? Something funky with zod.
            query as CollectionReference<PosiFormData>
          }
        />
      )}
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        href="/posi/upload"
        color="primary"
      >
        <PlusOne sx={{ mr: 1 }} />
        <Typography>Agrega tu impacto!</Typography>
      </Fab>
    </Box>
  );
};

export default Index;
