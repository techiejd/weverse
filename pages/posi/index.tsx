import { Box, CircularProgress, Fab, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  castFirestoreDocToPosiFormData,
  PosiFormData,
} from "../../modules/posi/input/context";
import { getDocs, collection } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { PlusOne } from "@mui/icons-material";
import ImpactCard from "../../modules/posi/impactCard";

const Index = () => {
  //TODO(techiejd): Decouple the form data input from the impacts db output.
  //For example, maker info can go into a different collection.
  const [impactsAndIds, setImpactsAndIds] = useState<[string, PosiFormData][]>(
    []
  );
  const appState = useAppState();
  useEffect(() => {
    if (appState) {
      const getImpacts = async () => {
        const querySnapshot = await getDocs(
          collection(appState.firestore, "impacts")
        );
        setImpactsAndIds(
          querySnapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            return [docSnapshot.id, castFirestoreDocToPosiFormData.parse(data)];
          })
        );
      };
      getImpacts();
    }
  }, [appState, setImpactsAndIds]);

  return (
    <Box mb={9}>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", m: 1 }}
        spacing={1}
      >
        <Typography variant="h1" justifyContent={"center"}>
          📺 <b>We</b>Screen
        </Typography>
        {impactsAndIds.length == 0 ? (
          <CircularProgress />
        ) : (
          impactsAndIds.map(([id, impact], i) => (
            <ImpactCard key={i} posiData={impact} id={id} />
          ))
        )}
      </Stack>
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
