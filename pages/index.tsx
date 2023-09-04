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
import PlusOne from "@mui/icons-material/PlusOne";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../common/components/onewePage";
import { useAppState } from "../common/context/appState";
import { usePosiFormDataConverter } from "../common/utils/firebase";
import { WithTranslationsStaticProps } from "../common/utils/translations";
import { PosiFormData } from "../functions/shared/src";
import ImpactCard from "../modules/posi/action/card";
import Link from "next/link";
import Image from "next/image";
import { useMyMember } from "../common/context/weverseUtils";

export const getStaticProps = WithTranslationsStaticProps();

const BottomBar = () => {
  const [myMember] = useMyMember();
  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add("animate");
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);

  const t = useTranslations("index");

  return (
    <div
      className="rounded-[43px] bg-gray-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] overflow-hidden flex flex-row p-[0.63rem] items-center justify-center gap-[0.63rem] border-[4px] border-solid border-dimgray [&.animate]:lg:animate-[1s_ease_0s_1_normal_forwards_fade-in-top] lg:opacity-[0]"
      data-animate-on-scroll
    >
      <Link
        href={
          myMember
            ? `/members/${myMember.id}`
            : "/members/logIn?registerRequested=true"
        }
        className="cursor-pointer [border:none] p-[0.63rem] bg-gray-100 overflow-hidden flex flex-col items-start justify-start"
        style={{ textDecoration: "none" }}
      >
        <div className="w-[3.63rem] h-[2.72rem] flex flex-col items-center justify-start gap-[0.25rem]">
          <div className="relative w-[1.88rem] h-[1.88rem]">
            <Image fill alt="" src="/profile-icon1.svg" />
          </div>
          <b className="relative text-[0.75rem] font-bottom-nav-bar-label-text text-bottom-nav-bar-icons-inactive text-center">
            {t("myPage")}
          </b>
        </div>
      </Link>
      <Link
        href="/posi/upload"
        className="cursor-pointer [border:none] p-[0.63rem] bg-gray-200 overflow-hidden flex flex-row items-start justify-start"
        style={{ textDecoration: "none" }}
      >
        <div className="w-[3.06rem] h-[2.75rem] flex flex-col items-center justify-start gap-[0.31rem]">
          <div className="relative w-[1.88rem] h-[1.88rem]">
            <Image
              fill
              alt=""
              src="/group.svg"
              style={{ objectFit: "contain" }}
            />
          </div>
          <b className="relative text-[0.75rem] font-bottom-nav-bar-label-text text-bottom-nav-bar-icons-inactive text-left">
            {t("publish")}
          </b>
        </div>
      </Link>
    </div>
  );
};

const IndexPage = () => {
  const commonTranslations = useTranslations("common");
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
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pt: 3,
          pb: 3,
        }}
        spacing={3}
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
      </Stack>
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
  return (
    <Box>
      <IndexPage />
      <Box
        sx={{
          bottom: 16,
          width: "100%",
          position: "fixed",
          top: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BottomBar />
      </Box>
    </Box>
  );
});

export default Index;
