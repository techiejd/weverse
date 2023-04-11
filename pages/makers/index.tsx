import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { AppState, useAppState } from "../../common/context/appState";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MakerCard from "../../modules/makers/MakerCard";

const MakersListed = ({ appState }: { appState: AppState }) => {
  const [makersSnapshot, loading, error] = useCollection(
    collection(appState.firestore, "makers")
  );

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
    console.log(makersSnapshot);
    makersSnapshot?.docChanges().forEach((docChange) => {
      console.log(docChange);
      // TODO(techiejd): Look into the other scenarios.
      if (docChange.type == "added") {
        setMakers((makers) => [...makers, docChange.doc.id]);
      }
    });
  }, [makersSnapshot]);
  return (
    <Stack>
      {error && (
        <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
      )}
      {loading && <Loading />}
      {makers.map((maker) => (
        <MakerCard makerId={maker} key={maker} />
      ))}
    </Stack>
  );
};

const Makers = () => {
  const appState = useAppState();
  return appState ? <MakersListed appState={appState} /> : <CircularProgress />;
};

export default Makers;
