import {
  AppBar,
  Box,
  CircularProgress,
  Fab,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { AppState, useAppState } from "../../common/context/appState";
import { Menu, More, PlusOne, Search } from "@mui/icons-material";
import PageTitle from "../../common/components/pageTitle";
import { PosiFormData } from "../../functions/shared/src";
import { posiFormDataConverter } from "../../common/utils/firebase";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState } from "react";
import ImpactCard from "../../modules/posi/action/card";

const IndexPage = ({ appState }: { appState: AppState }) => {
  const [latestDoc, setLatestDoc] = useState<
    QueryDocumentSnapshot<PosiFormData> | undefined
  >(undefined);
  const [actions, setActions] = useState<PosiFormData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const batchSize = 3;

  useEffect(() => {
    let ignore = false;
    const firstQuery = query(
      collection(appState.firestore, "impacts").withConverter(
        posiFormDataConverter
      ),
      limit(batchSize),
      orderBy("createdAt", "desc")
    );
    getDocs(firstQuery).then((snap) => {
      if (!ignore) {
        const latestActions = snap.docs.map((doc) => doc.data());
        if (latestActions.length) {
          setLatestDoc(snap.docs[snap.docs.length - 1]);
        }
        setHasMore(latestActions.length == batchSize);
        setActions((actions) => [...actions, ...latestActions]);
      }
    });
    return () => {
      ignore = true;
    };
  }, [appState.firestore]);

  const next = useCallback(() => {
    const nextQuery = query(
      collection(appState.firestore, "impacts").withConverter(
        posiFormDataConverter
      ),
      orderBy("createdAt", "desc"),
      startAfter(latestDoc),
      limit(batchSize)
    );
    getDocs(nextQuery).then((snap) => {
      const latestActions = snap.docs.map((doc) => doc.data());
      if (latestActions.length) {
        setLatestDoc(snap.docs[snap.docs.length - 1]);
      }
      setHasMore(latestActions.length == batchSize);
      setActions((actions) => [...actions, ...latestActions]);
    });
  }, [appState.firestore, setHasMore, setActions, latestDoc, setLatestDoc]);

  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={<LinearProgress />}
      dataLength={actions.length}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Grid container spacing={1}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={action.id}>
            <ImpactCard posiData={action} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};

const Index = () => {
  const appState = useAppState();
  const fullHeightPage = (
    <style global jsx>{`
      html,
      body,
      main,
      body > div:first-child,
      div#__next,
      div#__next > div {
        height: 100%;
      }
    `}</style>
  );

  return (
    <Box mb={9} /** For the fab icon space. */>
      {fullHeightPage}
      <PageTitle title={<>🤸 Actions</>} />
      {appState ? <IndexPage appState={appState} /> : <CircularProgress />}
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
        <Typography>Agrega tu Action!</Typography>
      </Fab>
    </Box>
  );
};

export default Index;
