import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
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
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
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
import { Locale, PosiFormData } from "../functions/shared/src";
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
import PublishDialog from "../common/components/publishDialog";

export const getStaticProps = WithTranslationsStaticProps();

const BottomBar = () => {
  const [myMember] = useMyMember();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const closePublishDialog = useCallback(() => {
    setPublishDialogOpen(false);
  }, [setPublishDialogOpen]);
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
  const callToActionTranslations = useTranslations("common.callToAction");

  return (
    <div
      className="bottom-navigation-bar rounded-[50px] bg-whitesmoke-200 overflow-hidden flex flex-row py-0 px-4 items-center justify-center gap-[12px] opacity-[0] border-[4px] border-solid border-lightgray [&.animate]:animate-[1s_ease_0s_1_normal_forwards_fade-in-top]"
      data-animate-on-scroll
    >
      <PublishDialog open={publishDialogOpen} close={closePublishDialog} />
      <Link
        href={
          myMember
            ? `/${myMember.path}`
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
      <div
        onClick={() => {
          setPublishDialogOpen(true);
        }}
        className="cursor-pointer [border:none] py-2 px-2.5 bg-[transparent] overflow-hidden flex flex-row items-start justify-start"
      >
        <div className="w-[49px] h-11 flex flex-col items-center justify-start gap-[5px]">
          <div className="relative w-[30px] h-[30px]">
            <Image fill alt="" src="/group.svg" />
          </div>
          <b className="relative text-xs font-bottom-nav-bar-label-text text-bottom-nav-bar-icons-inactive text-left">
            {callToActionTranslations("publish")}
          </b>
        </div>
      </div>
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
  const [oneWeInitiative] = useInitiative(
    "/members/Xhge4AaVYBRGqAObaIMYBLSlaf42/initiatives/275EEG2k7FUKYCITnk0Z"
  );
  const [sponsorOneWeOpen, setSponsorOneWeOpen] = useState(false);
  const [mySponsorships] = useMySponsorships();
  const sponsoring =
    oneWeInitiative && mySponsorships
      ? mySponsorships.some(
          (s) => s.initiative == oneWeInitiative.path && !!s.paymentsStarted
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
            href="/members/Xhge4AaVYBRGqAObaIMYBLSlaf42/initiatives/275EEG2k7FUKYCITnk0Z/impact/upload"
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

function isContentAction(action: PosiFormData, chosenLocales: Locale[]) {
  return Object.keys(action).some((l) => chosenLocales.includes(l as any));
}

const IndexPage = () => {
  //TODO(techiejd): WET code, refactor
  const commonTranslations = useTranslations("common");
  const t = useTranslations("index");
  const appState = useAppState();
  const [latestDoc, setLatestDoc] = useState<
    QueryDocumentSnapshot<PosiFormData> | undefined
  >(undefined);
  const [myMember] = useMyMember();
  const [cachedActions, setCachedActions] = useState<PosiFormData[]>([]);
  const [displayedActions, setDisplayedActions] = useState<PosiFormData[]>([]);
  const posiFormDataConverter = usePosiFormDataConverter();
  const batchSize = 3;
  const chosenLocales = appState.languages.content;
  const router = useRouter();
  const [countMeInDialogOpen, setCountMeInDialogOpen] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      const { requestCountMeInDialogOpen } = router.query;
      setCountMeInDialogOpen(Boolean(requestCountMeInDialogOpen));
    }
  }, [router.isReady, router.query]);

  const fetchActions = useCallback(
    async ({ startDoc }: { startDoc: any | undefined }) => {
      let currLatestDoc = startDoc;
      console.log({ currLatestDoc });
      let latestActions: PosiFormData[] = [];
      let latestContentActions: PosiFormData[] = [];
      let enoughLatestContentActions = false;
      let hasMore = true;
      do {
        const snap: QuerySnapshot<PosiFormData> = await getDocs(
          query(
            collectionGroup(appState.firestore, "actions").withConverter(
              posiFormDataConverter
            ),
            limit(batchSize),
            orderBy("createdAt", "desc"),
            ...(currLatestDoc ? [startAfter(currLatestDoc)] : [])
          )
        );
        currLatestDoc = snap.docs.slice(-1)[0];
        latestActions = [
          ...latestActions,
          ...snap.docs.map((doc) => doc.data()),
        ];
        console.log({ latestActions });
        latestContentActions = latestActions.filter((action) =>
          isContentAction(action, chosenLocales)
        );
        enoughLatestContentActions = latestContentActions.length >= batchSize;
        console.log({ enoughLatestContentActions, hasMore });
        hasMore = snap.docs.length == batchSize;
      } while (!enoughLatestContentActions && hasMore);

      setLatestDoc(hasMore ? currLatestDoc : undefined);
      return latestActions;
    },
    [appState.firestore, chosenLocales, posiFormDataConverter]
  );

  useEffect(() => {
    (async () => {
      setCachedActions(await fetchActions({ startDoc: undefined }));
    })();
  }, [fetchActions]);

  useEffect(() => {
    console.log({ cachedActions });
    setDisplayedActions([
      ...cachedActions.filter((action) =>
        isContentAction(action, chosenLocales)
      ),
    ]);
  }, [cachedActions, chosenLocales]);

  const next = useCallback(() => {
    (async () => {
      const latestActions = await fetchActions({ startDoc: latestDoc });
      setCachedActions((actions) => {
        console.log({ actions, latestActions });
        return [...actions, ...latestActions];
      });
    })();
  }, [fetchActions, latestDoc]);

  return (
    <InfiniteScroll
      next={next}
      hasMore={latestDoc != undefined}
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
      </Stack>
      <Grid container spacing={1} pl={1} pr={1}>
        {displayedActions.map((action) => (
          <Grid item xs={12} md={6} lg={4} key={action.path}>
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
