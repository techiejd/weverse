import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { AppState, useAppState } from "../../common/context/appState";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MakerCard from "../../modules/makers/MakerCard";
import { makerConverter } from "../../common/context/weverse";

const MakersListed = ({ appState }: { appState: AppState }) => {
  const [makersSnapshot, loading, error] = useCollection(
    collection(appState.firestore, "makers").withConverter(makerConverter)
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
    makersSnapshot?.docChanges().forEach((docChange) => {
      // TODO(techiejd): Look into the other scenarios.
      if (docChange.type == "added") {
        setMakers((makers) => [...makers, docChange.doc.id]);
      }
    });
  }, [makersSnapshot]);
  return (
    <Stack
      sx={{ alignItems: "center", justifyContent: "center", p: 1 }}
      spacing={1}
    >
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
