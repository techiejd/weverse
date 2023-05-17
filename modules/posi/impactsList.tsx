import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { CollectionReference } from "firebase/firestore";
import ImpactCard from "./action/card";
import { PosiFormData } from "shared";

const ImpactsList = ({
  impactsQuery,
}: {
  impactsQuery: CollectionReference<PosiFormData>;
}) => {
  const [impactsSnapshot, loading, error] = useCollection(impactsQuery);
  const [impacts, setImpacts] = useState<PosiFormData[]>([]);
  useEffect(() => {
    impactsSnapshot?.docChanges().forEach((docChange) => {
      // TODO(techiejd): Look into the other scenarios.
      if (docChange.type == "added") {
        setImpacts((impacts) => [...impacts, docChange.doc.data()]);
      }
    });
  }, [impactsSnapshot]);

  const Loading = () => {
    return (
      <Box>
        <Typography>Impacts: Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h2">Acciones</Typography>
      {error && (
        <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
      )}
      {loading && <Loading />}
      {!loading && !error && impacts.length == 0 && (
        <Typography>No hay ninguna acción aquí.</Typography>
      )}
      <Grid container spacing={1}>
        {impacts.map((impact) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={impact.id}>
            <ImpactCard posiData={impact} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImpactsList;
