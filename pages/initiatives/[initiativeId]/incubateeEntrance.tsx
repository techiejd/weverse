import { useTranslations } from "next-intl";
import { useCurrentInitiative } from "../../../modules/initiatives/context";
import {
  useCurrentIncubatees,
  useInitiative,
  useMyInitiative,
} from "../../../common/context/weverseUtils";
import {
  Stack,
  Avatar,
  Typography,
  Button,
  Grid,
  Link,
  Dialog,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LogInPrompt from "../../../common/components/logInPrompt";
import { sectionStyles } from "../../../common/components/theme";
import { CachePaths } from "../../../common/utils/staticPaths";
import { asOneWePage } from "../../../common/components/onewePage";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import InitiativeCard from "../../../modules/initiatives/InitiativeCard";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useAppState } from "../../../common/context/appState";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import {
  useIncubateeConverter,
  useInitiativeConverter,
} from "../../../common/utils/firebase";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

type DialogMode =
  | "processing"
  | "selfIncubationError"
  | "success"
  | "changeIncubatorPrompt"
  | "notAnIncubatorError";

const IncubateeEntrance = asOneWePage(() => {
  const [incubator] = useCurrentInitiative();
  const [myInitiative] = useMyInitiative();
  const [theirIncubatees] = useCurrentIncubatees();
  const [acceptedIncubatees, setAcceptedIncubatees] = useState(
    theirIncubatees?.filter((incubatee) => incubatee?.acceptedInvite)
  );
  const t = useTranslations("initiatives.incubateeEntrance");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("processing");
  const appState = useAppState();
  const incubateeConverter = useIncubateeConverter();
  const initiativeConverter = useInitiativeConverter();

  const connectIncubateeToIncubator = useCallback(async () => {
    if (myInitiative?.id && incubator?.id) {
      const addInitiativeToIncubator = setDoc(
        doc(
          appState.firestore,
          "initiatives",
          incubator.id,
          "incubatees",
          myInitiative.id
        ).withConverter(incubateeConverter),
        {
          acceptedInvite: true,
        }
      );
      const addIncubatorToInitiative = updateDoc(
        doc(appState.firestore, "initiatives", myInitiative.id).withConverter(
          initiativeConverter
        ),
        {
          incubator: incubator.id,
        }
      );
      return Promise.all([addInitiativeToIncubator, addIncubatorToInitiative]);
    }
  }, [
    appState.firestore,
    incubateeConverter,
    incubator?.id,
    initiativeConverter,
    myInitiative?.id,
  ]);

  useEffect(() => {
    setAcceptedIncubatees(
      theirIncubatees?.filter((incubatee) => incubatee?.acceptedInvite)
    );
  }, [theirIncubatees]);

  useEffect(() => {
    if (
      acceptedIncubatees?.some(
        (incubatee) => incubatee?.id === myInitiative?.id
      )
    ) {
      setDialogMode("success");
    }
  }, [acceptedIncubatees, myInitiative]);

  const handleEnter = useCallback(() => {
    // We can assume the member is signed in and have an initiative at this point.
    // If the member's initiative does not yet have an incubator, we set the incubator to the current initiative.
    // If the member's initiative already has an incubator, we prompt the user again to confirm the change.
    // If the member's initiative is already an incubatee of the current initiative, we skip straight to the congratulations message.
    // If the member's initiative is the current incubator, we bring error letting user know they can not self incuabte.
    let dialogMode: DialogMode = "processing";
    if (myInitiative?.id === incubator?.id) {
      dialogMode = "selfIncubationError";
      setDialogMode("selfIncubationError");
    }
    if (myInitiative?.incubator && myInitiative?.incubator !== incubator?.id) {
      dialogMode = "changeIncubatorPrompt";
      setDialogMode("changeIncubatorPrompt");
    }
    if (dialogMode === "processing") {
      setDialogMode("processing");
      connectIncubateeToIncubator();
    }
    setDialogOpen(true);
  }, [myInitiative, incubator, connectIncubateeToIncubator]);

  const transferIncubateeFromPreviousIncubator = useCallback(async () => {
    // Simple, we just remove the incubatee from the previous incubator and
    // add it to the current incubator.
    deleteDoc(
      doc(
        appState.firestore,
        "initiatives",
        myInitiative?.incubator!,
        "incubatees",
        myInitiative?.id!
      )
    );
    connectIncubateeToIncubator();
  }, [appState.firestore, connectIncubateeToIncubator, myInitiative]);

  useEffect(() => {
    // If the current initiative is not an incubator, we open the dialog in notAnIncubatorError.
    if (incubator && incubator.organizationType !== "incubator") {
      setDialogMode("notAnIncubatorError");
      setDialogOpen(true);
    }
  }, [incubator]);

  const alreadyIncubated = acceptedIncubatees?.some(
    (incubatee) => incubatee?.id === myInitiative?.id
  );

  const MyDialogContent = () => {
    const [myIncubator] = useInitiative(myInitiative?.incubator);
    const t = useTranslations("initiatives.incubateeEntrance.dialog");
    const commonTranslations = useTranslations("common");
    const inputTranslations = useTranslations("input");
    const homeButton = (
      <Button variant="outlined" href={`/`}>
        {commonTranslations("callToAction.home")}
      </Button>
    );
    const okButton = (
      <Button variant="contained" onClick={() => setDialogOpen(false)}>
        {inputTranslations("ok")}
      </Button>
    );
    const tryWithDifferentInitiative = (
      <Typography>{t("tryWithDifferentInitiative")}</Typography>
    );
    switch (dialogMode) {
      case "processing":
        return <DialogContent>{<CircularProgress />}</DialogContent>;
      case "selfIncubationError":
        return (
          <Fragment>
            <DialogTitle variant="h2">
              {t("selfIncubationErrorTitle")}
            </DialogTitle>
            <DialogContent>{tryWithDifferentInitiative}</DialogContent>
            <DialogActions>{okButton}</DialogActions>
          </Fragment>
        );
      case "success":
        return (
          <Fragment>
            <DialogTitle variant="h2">{t("successTitle")}</DialogTitle>
            <DialogContent>
              <Typography>{t("successMessage")}</Typography>
            </DialogContent>
            <DialogActions>
              {homeButton}
              <Button
                variant="contained"
                href={`/initiatives/${myInitiative?.id}`}
              >
                {t("viewMyInitiative")}
              </Button>
            </DialogActions>
          </Fragment>
        );
      case "changeIncubatorPrompt":
        return (
          <Fragment>
            <DialogTitle variant="h2">
              {t("changeIncubatorPromptTitle")}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {t.rich("currentlyIncubatedBy", {
                  incubatorName: myIncubator?.name,
                  incubatorNameTag: (incubatorName) => (
                    <Link
                      href={`/initiatives/${myIncubator?.id}`}
                    >{`${incubatorName}`}</Link>
                  ),
                })}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setDialogOpen(false)}>
                {inputTranslations("cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  transferIncubateeFromPreviousIncubator();
                  setDialogMode("processing");
                }}
              >
                {inputTranslations("yes")}
              </Button>
            </DialogActions>
          </Fragment>
        );
      case "notAnIncubatorError":
        return (
          <Fragment>
            <DialogTitle variant="h2">
              {t("notAnIncubatorErrorTitle")}
            </DialogTitle>
            <DialogContent>{tryWithDifferentInitiative}</DialogContent>
            <DialogActions>
              {homeButton}
              {okButton}
            </DialogActions>
          </Fragment>
        );
    }
  };
  return (
    <Fragment>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (dialogMode == "success" || dialogMode == "changeIncubatorPrompt")
            setDialogOpen(false);
        }}
      >
        <MyDialogContent />
      </Dialog>
      <Stack>
        <Stack
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center" }}
          p={2}
        >
          {incubator?.pic && (
            <Avatar src={incubator.pic} sx={{ width: 112, height: 112 }} />
          )}
          {t.rich("title", {
            initiativeName: incubator?.name,
            initiativeNameTag: (initiativeName) => (
              <Typography variant="h2">
                <Link
                  href={`/initiatives/${incubator?.id}`}
                  sx={{ color: "black" }}
                >{`${initiativeName}`}</Link>
              </Typography>
            ),
            prompt: (p) => (
              <Typography variant="h2" textAlign="center">
                {p}
              </Typography>
            ),
          })}

          {myInitiative && !alreadyIncubated && (
            <Stack
              spacing={2}
              sx={[
                sectionStyles,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Typography>{t("whyEnter")}</Typography>
              <Button
                variant="contained"
                sx={{ width: "fit-content" }}
                onClick={handleEnter}
              >
                {t("callToAction")}
              </Button>
            </Stack>
          )}
          {!myInitiative && <LogInPrompt title={t("logInPrompt")} />}
          {alreadyIncubated && (
            <Typography
              sx={[
                sectionStyles,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {t("alreadyIncubated")}
            </Typography>
          )}
        </Stack>
        <Stack
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f3f3f3",
            p: 2,
          }}
        >
          <Typography variant="h2" key={"for"}>
            {t("acceptedIncubateeInitiatives")}
          </Typography>
          <Grid key="actionsGridUploadSocialProofPrompt" container spacing={1}>
            {acceptedIncubatees &&
              acceptedIncubatees.map((incubatee, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
                  <InitiativeCard initiativeId={incubatee?.id!} />
                </Grid>
              ))}
          </Grid>
        </Stack>
      </Stack>
    </Fragment>
  );
});

export default IncubateeEntrance;
