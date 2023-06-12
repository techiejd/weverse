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
import { PlusOne } from "@mui/icons-material";
import { Content, PosiFormData, SocialProof } from "../../functions/shared/src";
import { contentConverter } from "../../common/utils/firebase";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState } from "react";
import ImpactCard from "../../modules/posi/action/card";
import SocialProofCard from "../../modules/posi/socialProofCard";

const IndexPage = () => {
  const appState = useAppState();
  const [latestDoc, setLatestDoc] = useState<
    QueryDocumentSnapshot<Content> | undefined
  >(undefined);
  const [content, setContent] = useState<Content[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const batchSize = 3;

  useEffect(() => {
    let ignore = false;
    const firstQuery = query(
      collection(appState.firestore, "content").withConverter(contentConverter),
      limit(batchSize),
      orderBy("createdAt", "desc")
    );
    getDocs(firstQuery).then((snap) => {
      if (!ignore) {
        const latestContent = snap.docs.map((doc) => doc.data());
        if (latestContent.length) {
          setLatestDoc(snap.docs[snap.docs.length - 1]);
        }
        setHasMore(latestContent.length == batchSize);
        setContent((c) => [...c, ...latestContent]);
      }
    });
    return () => {
      ignore = true;
    };
  }, [appState.firestore]);

  const next = useCallback(() => {
    if (!latestDoc) {
      return;
    }
    const nextQuery = query(
      collection(appState.firestore, "content").withConverter(contentConverter),
      orderBy("createdAt", "desc"),
      startAfter(latestDoc),
      limit(batchSize)
    );
    getDocs(nextQuery).then((snap) => {
      const latestContents = snap.docs.map((doc) => doc.data());
      if (latestContents.length) {
        setLatestDoc(snap.docs[snap.docs.length - 1]);
      }
      setHasMore(latestContents.length == batchSize);
      setContent((c) => [...c, ...latestContents]);
    });
  }, [setHasMore, setContent, latestDoc, setLatestDoc, appState.firestore]);

  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={<LinearProgress />}
      dataLength={content.length}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Grid container spacing={1} pl={1} pr={1}>
        {content.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={c.id}>
            {c.data &&
              (c.type == "action" ? (
                <ImpactCard posiData={c.data as PosiFormData} />
              ) : (
                <SocialProofCard
                  socialProof={c.data as SocialProof}
                  showAction
                  showMaker
                />
              ))}
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
          Apoyando acciones que cambian el mundo
        </Typography>
        <Fab
          variant="extended"
          href="/posi/upload"
          color="primary"
          sx={{ width: "fit-content" }}
        >
          <PlusOne sx={{ mr: 1 }} />
          <Typography>Agrega tu acción!</Typography>
        </Fab>
        <IndexPage />
      </Stack>
    </Box>
  );
};

export default Index;
