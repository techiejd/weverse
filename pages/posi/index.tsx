import {
  Box,
  Fab,
  Grid,
  LinearProgress,
  Stack,
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
import { useAppState } from "../../common/context/appState";
import PlusOne from "@mui/icons-material/PlusOne";
import { PosiFormData } from "../../functions/shared/src";
import { usePosiFormDataConverter } from "../../common/utils/firebase";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState } from "react";
import ImpactCard from "../../modules/posi/action/card";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../common/components/onewePage";

export const getStaticProps = WithTranslationsStaticProps();
const IndexPage = () => {
  const appState = useAppState();
  const [latestDoc, setLatestDoc] = useState<
    QueryDocumentSnapshot<PosiFormData> | undefined
  >(undefined);
  const [actions, setActions] = useState<PosiFormData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const posiFormDataConverter = usePosiFormDataConverter();
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
  }, [appState.firestore, posiFormDataConverter]);

  const next = useCallback(() => {
    if (!latestDoc) {
      return;
    }
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
  }, [latestDoc, appState.firestore, posiFormDataConverter]);

  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={<LinearProgress />}
      dataLength={actions.length}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Grid container spacing={1} pl={1} pr={1}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={action.id}>
            <ImpactCard posiData={action} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};

const Index = asOneWePage(() => {
  const commonTranslations = useTranslations("common");
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
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        spacing={3}
        pt={3}
      >
        <Typography fontSize={25} variant="h2" textAlign="center" pb={1}>
          {commonTranslations("motto")}
        </Typography>
        <Fab
          variant="extended"
          href="/posi/upload"
          color="primary"
          sx={{ width: "fit-content" }}
        >
          <PlusOne sx={{ mr: 1 }} />
          <Typography>
            {commonTranslations("callToAction.actions.add")}
          </Typography>
        </Fab>
        <IndexPage />
      </Stack>
    </Box>
  );
});

export default Index;
