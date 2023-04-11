import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { query, collection, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { AppState, useAppState } from "../../common/context/appState";
import MakerCard from "../../modules/makers/MakerCard";
import { PosiFormData, posiFormData } from "../../modules/posi/input/context";
import { useEffect, useState } from "react";
import ImpactCard from "../../modules/posi/impactCard";
import { useRouter } from "next/router";

const MakerPageContent = ({
  appState,
  makerId,
}: {
  appState: AppState;
  makerId: string;
}) => {
  const [impactsSnapshot, loading, error] = useCollection(
    query(
      collection(appState.firestore, "makers"),
      where("makerId", "==", makerId)
    )
  );
  const [impacts, setImpacts] = useState<{ data: PosiFormData; id: string }[]>(
    []
  );

  //TODO(techiejd): Look into a more modularize way of doing this.
  const Loading = () => {
    return (
      <Box>
        <Typography>Makers: Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  };

  useEffect(() => {
    impactsSnapshot?.docChanges().forEach((docChange) => {
      console.log("AYO");
      if (docChange.type == "added") {
        setImpacts((impacts) => [
          ...impacts,
          {
            data: posiFormData.parse(docChange.doc.data()),
            id: docChange.doc.id,
          },
        ]);
      }
    });
  }, [impactsSnapshot]);
  return (
    <Stack>
      <MakerCard makerId={makerId} />
      {error && (
        <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
      )}
      {loading && <Loading />}
      {!loading && !error && impacts.length == 0 && (
        <Typography>No has subido ningun impacto.</Typography>
      )}
      {impacts.map((impact) => (
        <ImpactCard posiData={impact.data} id={impact.id} key={impact.id} />
      ))}
    </Stack>
  );
};

const MakerPage = () => {
  const appState = useAppState();
  const router = useRouter();
  const { makerId } = router.query;
  return appState ? (
    <MakerPageContent appState={appState} makerId={String(makerId)} />
  ) : (
    <CircularProgress />
  );
};

export default MakerPage;
