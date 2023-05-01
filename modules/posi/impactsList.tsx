import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { PosiFormData } from "./input/context";
import { CollectionReference } from "firebase/firestore";
import ImpactCard from "./impactCard";

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
    <Stack
      sx={{ alignItems: "center", justifyContent: "center", p: 1 }}
      spacing={1}
    >
      {error && (
        <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
      )}
      {loading && <Loading />}
      {!loading && !error && impacts.length == 0 && (
        <Typography>No hay ninguna Action aquí.</Typography>
      )}
      {impacts.map((impact) => {
        return <ImpactCard posiData={impact} key={impact.id} />;
      })}
    </Stack>
  );
};

export default ImpactsList;
