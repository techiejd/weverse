import {
  Box,
  Checkbox,
  CircularProgress,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import PlusOne from "@mui/icons-material/PlusOne";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { asOneWePage } from "../common/components/onewePage";
import { useAppState } from "../common/context/appState";
import {
  useMemberConverter,
  usePosiFormDataConverter,
} from "../common/utils/firebase";
import {
  WithTranslationsStaticProps,
  localeDisplayNames,
} from "../common/utils/translations";
import { Locale, PosiFormData, locale } from "../functions/shared/src";
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
      className="bottom-navigation-bar rounded-[50px] bg-whitesmoke-200 overflow-hidden flex flex-row py-0 px-4 items-center justify-center gap-[12px] opacity-[0] border-[4px] border-solid border-lightgray [&.animate]:animate-[1s_ease_0s_1_normal_forwards_fade-in-top]"
      data-animate-on-scroll
    >
      <Link
        href={
          myMember
            ? `/members/${myMember.id}`
            : "/members/logIn?registerRequested=true"
        }
        style={{ textDecoration: "none" }}
        className="cursor-pointer [border:none] py-2 px-2.5 bg-[transparent] overflow-hidden flex flex-col items-start justify-start"
      >
        <div className="w-[58px] h-[43.52px] flex flex-col items-center justify-start gap-[4px]">
          <div className="relative w-[30px] h-[30px]">
            <Image fill alt="" src="/profile-icon1.svg" />
          </div>
          <b className="relative text-xs font-bottom-nav-bar-label-text text-bottom-nav-bar-icons-inactive text-center">
            {t("myPage")}
          </b>
        </div>
      </Link>
      <Link
        href="/posi/upload"
        style={{ textDecoration: "none" }}
        className="cursor-pointer [border:none] py-2 px-2.5 bg-[transparent] overflow-hidden flex flex-row items-start justify-start"
      >
        <div className="w-[49px] h-11 flex flex-col items-center justify-start gap-[5px]">
          <div className="relative w-[30px] h-[30px]">
            <Image fill alt="" src="/group.svg" />
          </div>
          <b className="relative text-xs font-bottom-nav-bar-label-text text-bottom-nav-bar-icons-inactive text-left">
            Publicar
          </b>
        </div>
      </Link>
    </div>
  );
};

const IndexPage = () => {
  //TODO(techiejd): WET code, refactor
  const commonTranslations = useTranslations("common");
  const t = useTranslations("index");
  const appState = useAppState();
  const [latestDoc, setLatestDoc] = useState<
    QueryDocumentSnapshot<PosiFormData> | undefined
  >(undefined);
  const [myMember, myMemberLoading] = useMyMember();
  const memberConverter = useMemberConverter();
  const [cachedActions, setCachedActions] = useState<PosiFormData[]>([]);
  const [displayedActions, setDisplayedActions] = useState<PosiFormData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const posiFormDataConverter = usePosiFormDataConverter();
  const batchSize = 3;
  const userLocale = useLocale();
  const possibleLocales = Object.keys(locale.Enum);
  const [chosenLocales, setChosenLocales] = useState<Locale[]>(
    myMember?.settings?.locales ?? [userLocale as Locale]
  );

  useEffect(() => {
    if (myMember?.settings?.locales) {
      setChosenLocales(myMember?.settings?.locales ?? [userLocale as Locale]);
    }
  }, [myMember?.settings?.locales, userLocale]);

  const addLocale = useCallback(
    (l: Locale) => {
      if (!myMember || !myMember?.id) {
        setChosenLocales((prev) => [...prev, l as Locale]);
      }
      updateDoc(
        doc(appState.firestore, "members", myMember!.id!).withConverter(
          memberConverter
        ),
        {
          settings: {
            locales: [...(myMember!.settings?.locales ?? []), l as Locale],
          },
        }
      );
    },
    [appState.firestore, memberConverter, myMember]
  );

  const removeLocale = useCallback(
    (l: Locale) => {
      if (!myMember || !myMember?.id) {
        setChosenLocales((prev) => prev.filter((cl) => cl != l));
      }
      updateDoc(doc(appState.firestore, "members", myMember!.id!), {
        settings: {
          locales: myMember!.settings?.locales?.filter((cl) => cl != l),
        },
      });
    },
    [appState.firestore, myMember]
  );

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
        setCachedActions((actions) => [...actions, ...latestActions]);
      }
    });
    return () => {
      ignore = true;
    };
  }, [appState.firestore, posiFormDataConverter]);

  useEffect(() => {
    setDisplayedActions([
      ...cachedActions.filter((action) =>
        Object.keys(action).some((l) => chosenLocales.includes(l as any))
      ),
    ]);
  }, [cachedActions, chosenLocales]);

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
      setCachedActions((actions) => [...actions, ...latestActions]);
    });
  }, [latestDoc, appState.firestore, posiFormDataConverter]);

  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={<LinearProgress />}
      dataLength={displayedActions.length}
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
        {myMemberLoading ? (
          <CircularProgress />
        ) : (
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">{t("seeContentIn")}</FormLabel>
            <FormGroup row>
              {possibleLocales.map((l) => (
                <FormControlLabel
                  key={l}
                  control={
                    <Checkbox
                      checked={chosenLocales.includes(l as Locale)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          addLocale(l as Locale);
                        } else {
                          removeLocale(l as Locale);
                        }
                      }}
                    />
                  }
                  label={localeDisplayNames[l as Locale]}
                />
              ))}
            </FormGroup>
          </FormControl>
        )}
      </Stack>
      <Grid container spacing={1} pl={1} pr={1}>
        {displayedActions.map((action) => (
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
