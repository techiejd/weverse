import {
  AppBar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
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
import {
  useInitiative,
  useMyMember,
  useMySponsorships,
} from "../common/context/weverseUtils";
import ShareActionArea from "../common/components/shareActionArea";
import AuthDialog from "../modules/auth/AuthDialog";
import { AuthAction } from "../modules/auth/AuthDialog/context";
import Sponsor from "../modules/initiatives/sponsor";
import { useRouter } from "next/router";
import Close from "@mui/icons-material/Close";
import Share from "@mui/icons-material/Share";
import Login from "@mui/icons-material/Login";
import Campaign from "@mui/icons-material/Campaign";
import HeartHandshakeIcon from "../common/svg/HeartHandshake";

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
      className="rounded-[50px] bg-whitesmoke-200 overflow-hidden flex flex-row py-0 px-4 items-center justify-center gap-[12px] opacity-[0] border-[4px] border-solid border-lightgray [&.animate]:animate-[1s_ease_0s_1_normal_forwards_fade-in-top]"
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

const CountMeInDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [myMember] = useMyMember();
  const [oneWeInitiative] = useInitiative("275EEG2k7FUKYCITnk0Z");
  const [sponsorOneWeOpen, setSponsorOneWeOpen] = useState(false);
  const [sponsorships] = useMySponsorships();
  const sponsoring =
    oneWeInitiative && sponsorships
      ? sponsorships.some(
          (s) => s.initiative == oneWeInitiative.id && !!s.paymentsStarted
        )
      : false;
  const closeSponsorOneWe = useCallback(() => {
    setSponsorOneWeOpen(false);
  }, [setSponsorOneWeOpen]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const t = useTranslations("index.countMeInDialog");
  return (
    <Dialog
      open={open}
      onClose={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      fullScreen={fullScreen}
    >
      <AuthDialog
        open={authDialogOpen}
        setOpen={setAuthDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      <Dialog open={sponsorOneWeOpen} fullScreen>
        {oneWeInitiative && (
          <Sponsor
            exitButtonBehavior={{
              onClick: closeSponsorOneWe,
            }}
            beneficiary={oneWeInitiative}
          />
        )}
      </Dialog>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }}>{t("title")}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Typography>{t("contribute")}</Typography>
        <br />
        <Stack spacing={1}>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/8dIKfizbirA?si=9bzRmB_x61ye9ngO"
              title="How to join vid"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
          {!sponsoring && (
            <Button
              variant="outlined"
              onClick={() => {
                setSponsorOneWeOpen(true);
              }}
              startIcon={<HeartHandshakeIcon />}
            >
              {t("sponsorOneWe")}
            </Button>
          )}
          <Button
            variant="outlined"
            href="/posi/upload"
            startIcon={<PlusOne />}
          >
            {t("uploadAnAction")}
          </Button>
          {!myMember && (
            <Button
              variant="outlined"
              startIcon={<Login />}
              onClick={() => setAuthDialogOpen(true)}
            >
              {t("registerOrLoginPrompt")}
            </Button>
          )}
          <Button
            variant="outlined"
            href="/initiatives/275EEG2k7FUKYCITnk0Z/impact/upload"
            startIcon={<Campaign />}
          >
            {t("giveOneWeTestimonial")}
          </Button>
          <ShareActionArea
            shareProps={{
              path: "/",
              title: "Join the OneWe movement",
            }}
          >
            <Button variant="outlined" startIcon={<Share />}>
              {t("shareOneWe")}
            </Button>
          </ShareActionArea>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }}
        >
          {t("seeOneWe")}
        </Button>
      </DialogActions>
    </Dialog>
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
  const router = useRouter();
  const [countMeInDialogOpen, setCountMeInDialogOpen] = useState(false);
  console.log({ countMeInDialogOpen });
  useEffect(() => {
    if (router.isReady) {
      const { requestCountMeInDialogOpen } = router.query;
      setCountMeInDialogOpen(Boolean(requestCountMeInDialogOpen));
    }
  }, [router.isReady, router.query]);

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
          {commonTranslations("motto", {
            tense: myMember ? "present" : "imperative",
          })}
        </Typography>
        <Fab
          variant="extended"
          color="primary"
          sx={{ width: "fit-content" }}
          onClick={() => {
            setCountMeInDialogOpen(true);
          }}
        >
          <PlusOne sx={{ mr: 1 }} />
          <Typography>
            {commonTranslations("callToAction.countMeIn")}
          </Typography>
          <CountMeInDialog
            open={countMeInDialogOpen}
            onClose={() => {
              setCountMeInDialogOpen(false);
            }}
          />
        </Fab>
        {myMemberLoading ? (
          <CircularProgress />
        ) : (
          <FormControl
            sx={{ m: 3, pl: 2 }}
            component="fieldset"
            variant="standard"
          >
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
          <Grid item xs={12} md={6} lg={4} key={action.id}>
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
