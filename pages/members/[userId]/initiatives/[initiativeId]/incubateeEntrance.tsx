import { useTranslations } from "next-intl";
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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormHelperText,
} from "@mui/material";
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import LogInPrompt from "../../../../../common/components/logInPrompt";
import { asOneWePage } from "../../../../../common/components/onewePage";
import { sectionStyles } from "../../../../../common/components/theme";
import { useAppState } from "../../../../../common/context/appState";
import {
  splitPath,
  useIncubateeConverter,
  useInitiativeConverter,
} from "../../../../../common/utils/firebase";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import {
  Locale2Messages,
  WithTranslationsStaticProps,
} from "../../../../../common/utils/translations";
import InitiativeCard from "../../../../../modules/initiatives/InitiativeCard";
import {
  useMyInitiatives,
  useCurrentIncubatees,
  useInitiative,
} from "../../../../../common/context/weverseUtils";
import { useCurrentInitiative } from "../../../../../modules/initiatives/context";
import {
  Incubatee,
  Initiative,
  initiative,
} from "../../../../../functions/shared/src";
import { pickBy, identity } from "lodash";
import InitiativeInput from "../../../../../modules/initiatives/input";
import ExpandMore from "@mui/icons-material/ExpandMore";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

type DialogMode =
  | "processing"
  | "needAnInitiative"
  | "chooseInitiatives"
  | "success"
  | "notAnIncubatorError";

const PublishInitiativeDialog = ({
  open,
  close,
  locale2Messages,
}: {
  open: boolean;
  close: () => void;
  locale2Messages: Locale2Messages;
}) => {
  const appState = useAppState();
  const callToActionTranslations = useTranslations("common.callToAction");
  const [workingInitiative, setWorkingInitiative] = useState<Initiative>({
    name: appState.authState.user!.displayName!,
    type: "individual",
  });
  const [uploading, setUploading] = useState(false);
  const initiativeConverter = useInitiativeConverter();
  const initiativesCollection = collection(
    appState.firestore,
    "members",
    appState.authState.user!.uid,
    "initiatives"
  );

  //TODO(techiejd): WET -> DRY
  const editInitiativeTranslations = useTranslations("initiatives.edit");

  return (
    <Dialog open={open} onClose={close}>
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          justifyItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h1">
          {editInitiativeTranslations("publishTitle")}
        </Typography>
        <Typography variant="h2">
          {editInitiativeTranslations("initiativeDefinition")}
        </Typography>
      </Stack>
      <form
        onSubmit={async (e) => {
          setUploading(true);
          e.preventDefault();
          // TODO(techiejd): WET -> DRY
          const cleanedInitiative = pickBy(workingInitiative, identity);
          const parsedInitiative = initiative.parse(cleanedInitiative);
          const initiativeDoc = doc(initiativesCollection).withConverter(
            initiativeConverter
          );
          await setDoc(initiativeDoc, parsedInitiative);
          close();
        }}
      >
        <InitiativeInput
          userName={appState.authState.user!.displayName ?? ""}
          val={workingInitiative}
          setVal={setWorkingInitiative}
          locale2Messages={locale2Messages}
        />
        <Stack
          sx={{
            width: "100%",
            alignItems: "center",
            justifyItems: "center",
            pb: 2,
          }}
        >
          {uploading || workingInitiative.pic == "loading" ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained">
              {callToActionTranslations("publish")}
            </Button>
          )}
        </Stack>
      </form>
    </Dialog>
  );
};

const IncubatedBy = ({
  incubatorPath,
}: {
  incubatorPath: string | undefined;
}) => {
  const [incubator] = useInitiative(incubatorPath);
  const t = useTranslations("initiatives.incubateeEntrance.dialog");
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{t("warningPriorIncubatorWillBeRemoved")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {t.rich("currentlyIncubatedBy", {
            incubatorName: incubator?.name,
            incubatorNameTag: (incubatorName) => (
              <Link href={`/${incubatorPath}`}>{`${incubatorName}`}</Link>
            ),
          })}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const MyDialogContent = ({
  myInitiatives,
  acceptedIncubatees,
  close,
  locale2Messages,
}: {
  myInitiatives: Initiative[] | undefined;
  acceptedIncubatees: Incubatee[] | undefined;
  close: () => void;
  locale2Messages: Locale2Messages;
}) => {
  const appState = useAppState();
  const [incubator] = useCurrentInitiative();
  const [selectedInitiatives, setSelectedInitiatives] = useState<Initiative[]>(
    []
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>("chooseInitiatives");
  const [publishInitiativeDialogOpen, setPublishInitiativeDialogOpen] =
    useState(false);
  const incubateeConverter = useIncubateeConverter();
  const initiativeConverter = useInitiativeConverter();
  const t = useTranslations("initiatives.incubateeEntrance.dialog");
  const commonTranslations = useTranslations("common");
  const inputTranslations = useTranslations("input");
  const homeButton = (
    <Button variant="outlined" href={`/`}>
      {commonTranslations("callToAction.home")}
    </Button>
  );
  const okButton = (
    <Button variant="contained" onClick={() => close()}>
      {inputTranslations("ok")}
    </Button>
  );
  const tryWithDifferentInitiative = (
    <Typography>{t("tryWithDifferentInitiative")}</Typography>
  );

  useEffect(() => {
    if (
      dialogMode === "processing" &&
      selectedInitiatives.every((selectedInitiative) =>
        acceptedIncubatees?.some(
          (incubatee) => incubatee?.initiativePath === selectedInitiative.path
        )
      )
    ) {
      setDialogMode("success");
    }
  }, [acceptedIncubatees, selectedInitiatives, dialogMode]);

  useEffect(() => {
    if (incubator && incubator?.organizationType != "incubator") {
      setDialogMode("notAnIncubatorError");
    } else if (myInitiatives && !myInitiatives.length) {
      setDialogMode("needAnInitiative");
    }
  }, [incubator, myInitiatives]);

  useEffect(() => {
    if (dialogMode === "needAnInitiative" && myInitiatives?.length) {
      setDialogMode("chooseInitiatives");
    }
  }, [dialogMode, myInitiatives?.length]);

  const connectIncubateesToIncubator = useCallback(async () => {
    if (!selectedInitiatives.length || !incubator?.path) return;
    const batch = writeBatch(appState.firestore);
    for (const selectedInitiative of selectedInitiatives) {
      const { collection, id } = splitPath(selectedInitiative.path);
      if (!collection || !id) continue;
      batch.set(
        doc(appState.firestore, incubator.path, "incubatees", id).withConverter(
          incubateeConverter
        ),
        {
          initiativePath: selectedInitiative.path,
        }
      );
      if (selectedInitiative.incubator) {
        // Delete previous incubator reference if it exists
        batch.delete(
          doc(
            appState.firestore,
            selectedInitiative.incubator,
            "incubatees",
            id
          )
        );
      }
      batch.update(
        doc(appState.firestore, selectedInitiative.path!).withConverter(
          initiativeConverter
        ),
        {
          incubator: incubator.path,
        }
      );
    }
    return batch.commit();
  }, [
    appState.firestore,
    incubateeConverter,
    incubator?.path,
    initiativeConverter,
    selectedInitiatives,
  ]);

  switch (dialogMode) {
    case "processing":
      return <DialogContent>{<CircularProgress />}</DialogContent>;
    case "needAnInitiative":
      return (
        <Fragment>
          <PublishInitiativeDialog
            open={publishInitiativeDialogOpen}
            close={() => {
              setPublishInitiativeDialogOpen(false);
            }}
            locale2Messages={locale2Messages}
          />
          <DialogTitle variant="h2">{t("needAnInitiativeTitle")}</DialogTitle>
          <DialogContent>{t("publishAnInitiative")}</DialogContent>
          <DialogActions>
            {homeButton}
            <Button
              variant="contained"
              onClick={() => setPublishInitiativeDialogOpen(true)}
            >
              {commonTranslations("callToAction.publish")}
            </Button>
          </DialogActions>
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
            <Button variant="contained" href={`/${incubator?.path}`}>
              {t("viewIncubator")}
            </Button>
          </DialogActions>
        </Fragment>
      );
    case "chooseInitiatives":
      return (
        <Fragment>
          <PublishInitiativeDialog
            open={publishInitiativeDialogOpen}
            close={() => {
              setPublishInitiativeDialogOpen(false);
            }}
            locale2Messages={locale2Messages}
          />
          <DialogTitle variant="h2">{t("chooseInitiativesTitle")}</DialogTitle>
          <DialogContent>
            <FormGroup>
              {myInitiatives?.map((initiative) => (
                <Stack key={initiative.path!}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedInitiatives.includes(initiative)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setSelectedInitiatives((selectedInitiatives) => {
                            if (e.target.checked) {
                              return [...selectedInitiatives, initiative];
                            } else {
                              return selectedInitiatives.filter(
                                (selectedInitiative) =>
                                  selectedInitiative !== initiative
                              );
                            }
                          });
                        }}
                      />
                    }
                    label={initiative.name}
                    disabled={
                      incubator?.path == initiative.path ||
                      incubator?.path == initiative.incubator
                    }
                  />
                  {incubator?.path == initiative.incubator && (
                    <FormHelperText>{t("alreadyIncubating")}</FormHelperText>
                  )}
                  {initiative.incubator &&
                    !(incubator?.path == initiative.incubator) && (
                      <IncubatedBy incubatorPath={initiative.incubator} />
                    )}
                  {incubator?.path == initiative.path && (
                    <FormHelperText>{t("cantIncubateSelf")}</FormHelperText>
                  )}
                </Stack>
              ))}
            </FormGroup>
            <Button
              variant="text"
              onClick={() => {
                setPublishInitiativeDialogOpen(true);
              }}
            >
              {t("orPublishAnotherInitiative")}
            </Button>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => close()}>
              {inputTranslations("cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setDialogMode("processing");
                connectIncubateesToIncubator();
              }}
            >
              {inputTranslations("ok")}
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

const IncubateeEntrance = asOneWePage((locale2Messages: Locale2Messages) => {
  const [incubator] = useCurrentInitiative();
  const [myInitiatives] = useMyInitiatives();
  const [theirIncubatees] = useCurrentIncubatees();
  const [acceptedIncubatees, setAcceptedIncubatees] = useState(
    theirIncubatees?.filter((incubatee) => incubatee?.initiativePath)
  );
  const t = useTranslations("initiatives.incubateeEntrance");
  const [dialogOpen, setDialogOpen] = useState(false);
  const appState = useAppState();

  useEffect(() => {
    setAcceptedIncubatees(
      theirIncubatees?.filter((incubatee) => incubatee?.initiativePath)
    );
  }, [theirIncubatees]);

  return (
    <Fragment>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <MyDialogContent
          myInitiatives={myInitiatives}
          acceptedIncubatees={acceptedIncubatees}
          close={() => {
            setDialogOpen(false);
          }}
          locale2Messages={locale2Messages}
        />
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
                  href={`/${incubator?.path}`}
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

          {myInitiatives && (
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
                onClick={() => setDialogOpen(true)}
              >
                {t("callToAction")}
              </Button>
            </Stack>
          )}
          {!myInitiatives && <LogInPrompt title={t("logInPrompt")} />}
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
                  <InitiativeCard initiativePath={incubatee?.initiativePath!} />
                </Grid>
              ))}
          </Grid>
        </Stack>
      </Stack>
    </Fragment>
  );
});

export default IncubateeEntrance;
