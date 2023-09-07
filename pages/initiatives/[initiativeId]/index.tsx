import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { default as SupportIcon } from "@mui/icons-material/Support";
import Share from "@mui/icons-material/Share";
import Add from "@mui/icons-material/Add";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBox from "@mui/icons-material/CheckBox";
import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Check from "@mui/icons-material/Check";
import PersonAdd from "@mui/icons-material/PersonAdd";
import SupportBottomBar from "../../../common/components/supportBottomBar";
import {
  useCurrentActions,
  useCurrentImpacts,
  useCurrentInitiative,
} from "../../../modules/initiatives/context";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import ImpactCard from "../../../modules/posi/action/card";
import {
  useInitiativeTypeLabel,
  useCurrentIncubatees,
  useCurrentNeedsValidation,
  useMyInitiative,
} from "../../../common/context/weverseUtils";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import { Incubatee, Maker, PosiFormData } from "../../../functions/shared/src";
import { Content } from "../../../modules/posi/content";
import RatingsStack from "../../../common/components/ratings";
import ShareActionArea from "../../../common/components/shareActionArea";
import IconButtonWithLabel from "../../../common/components/iconButtonWithLabel";
import CenterBottomCircularProgress from "../../../common/components/centerBottomCircularProgress";
import CenterBottomFab from "../../../common/components/centerBottomFab";
import { useVipState } from "../../../common/utils/vip";
import { useRouter } from "next/router";
import SocialProofCard from "../../../modules/posi/socialProofCard";
import Sponsorships from "../../../modules/initiatives/sponsor/list";
import InitiativeCard from "../../../modules/initiatives/InitiativeCard";
import { useAppState } from "../../../common/context/appState";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import {
  buildShareLinks,
  useCopyToClipboard,
} from "../../../modules/initiatives/inviteAnInitiative";
import UnderConstruction from "../../../modules/posi/underConstruction";
import { usePosiFormDataConverter } from "../../../common/utils/firebase";
import {
  WithTranslationsStaticProps,
  useLocalizedPresentationInfo,
} from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../common/components/onewePage";
import Media from "../../../modules/posi/media";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
//TODO(techiejd): Clean up this file

const IncubatorSection = () => {
  const incubatorTranslations = useTranslations("initiatives.incubator");
  const appState = useAppState();
  const [incubatees] = useCurrentIncubatees();
  const acceptedIncubatees = incubatees?.filter(
    (incubatee) => incubatee.acceptedInvite
  );
  const notAcceptedIncubatees = incubatees?.filter(
    (incubatee) => !incubatee.acceptedInvite
  );
  const [needsValidation] = useCurrentNeedsValidation();
  const [myInitiative] = useMyInitiative();
  const [initiative] = useCurrentInitiative();
  const isMyInitiative =
    myInitiative && initiative && myInitiative.id == initiative.id;
  const [loading, setLoading] = useState(false);
  const [value, copy] = useCopyToClipboard();

  const InvitedIncubateePortal = ({ incubatee }: { incubatee: Incubatee }) => {
    const { path, href } = initiative
      ? buildShareLinks(incubatee.id!, initiative!.id!)
      : { path: "", href: "" };
    return loading ? (
      <CircularProgress />
    ) : (
      <Stack
        direction={"row"}
        key={incubatee.id}
        alignItems={"center"}
        spacing={2}
        sx={{ border: "1px solid", borderColor: "grey.300" }}
      >
        <IconButton
          onClick={() => {
            // Here we delete the initiative that had been invited by the incubator
            // And we delete the incubatee relationship with the incubator
            if (!initiative || !incubatee) return;
            setLoading(true);
            const incubateeRef = doc(
              appState.firestore,
              "makers",
              initiative.id!,
              "incubatees",
              incubatee.id!
            );
            const incubateeInitiativeRef = doc(
              appState.firestore,
              "makers",
              incubatee.id!
            );
            const batch = writeBatch(appState.firestore);
            batch.delete(incubateeRef);
            batch.delete(incubateeInitiativeRef);
            batch.commit();
            setLoading(false);
          }}
        >
          <Close />
        </IconButton>
        <InitiativeCard initiativeId={incubatee.id!} key={incubatee.id!} />
        <Stack spacing={2}>
          <IconButton onClick={() => copy(href)}>
            {value && value.includes(href) ? <Check /> : <ContentCopy />}
          </IconButton>
          <ShareActionArea
            shareProps={{
              title: incubatorTranslations("joinPrompt", {
                initiativeName: initiative?.name,
              }),
              path: path,
            }}
          >
            <IconButton>
              <Share />
            </IconButton>
          </ShareActionArea>
        </Stack>
      </Stack>
    );
  };

  const ValidateActionPortal = ({ action }: { action: PosiFormData }) => {
    const [validating, setValidating] = useState(false);
    const posiFormDataConverter = usePosiFormDataConverter();
    return (
      <Card>
        <CardHeader title={incubatorTranslations("isThisActionValid")} />
        <CardContent>
          <ImpactCard posiData={action} />
        </CardContent>
        <CardActions>
          {validating ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setValidating(true);
                updateDoc(
                  doc(appState.firestore, "impacts", action.id!).withConverter(
                    posiFormDataConverter
                  ),
                  {
                    "validation.validated": true,
                  }
                );
              }}
            >
              {incubatorTranslations("actionIsValid")}
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  const presentationInfo = useLocalizedPresentationInfo(initiative);

  return (
    <Fragment>
      <Typography variant="h2" sx={{ fontSize: "bold" }}>
        {incubatorTranslations("title")}
      </Typography>
      <Typography variant="h3">
        {incubatorTranslations("validationProcess.title")}
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {presentationInfo?.validationProcess ||
          incubatorTranslations("validationProcess.none")}
      </Typography>
      {isMyInitiative && (
        <Fragment>
          <Typography variant="h3">
            {incubatorTranslations("pendingValidation.title")}
          </Typography>
          {needsValidation && needsValidation.length > 0 ? (
            <Grid container spacing={1}>
              {needsValidation.map((action) => (
                <Grid item sm={12} md={6} lg={4} xl={3} key={action.id}>
                  <ValidateActionPortal key={action.id} action={action} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>
              {incubatorTranslations("pendingValidation.none")}
            </Typography>
          )}
        </Fragment>
      )}
      <Typography variant="h3">
        {incubatorTranslations("incubatees.title")}
      </Typography>
      <Stack spacing={2}>
        {acceptedIncubatees && acceptedIncubatees.length > 0 ? (
          acceptedIncubatees.map((incubatee) => (
            <InitiativeCard initiativeId={incubatee.id!} key={incubatee.id!} />
          ))
        ) : (
          <Typography>{incubatorTranslations("incubatees.none")}</Typography>
        )}
      </Stack>
      {isMyInitiative && (
        <Fragment>
          <Typography variant="h3">
            {incubatorTranslations("invited.title")}
          </Typography>
          <Stack spacing={2}>
            {notAcceptedIncubatees && notAcceptedIncubatees.length > 0 ? (
              notAcceptedIncubatees.map((incubatee) => (
                <InvitedIncubateePortal
                  key={incubatee.id!}
                  incubatee={incubatee}
                />
              ))
            ) : (
              <Typography>{incubatorTranslations("invited.none")}</Typography>
            )}
          </Stack>
        </Fragment>
      )}
    </Fragment>
  );
};

const AboutSection = ({ initiative }: { initiative?: Maker }) => {
  const aboutTranslations = useTranslations("initiatives.about");
  const presentationInfo = useLocalizedPresentationInfo(initiative);
  const noAboutInfo =
    !presentationInfo?.presentationVideo && !presentationInfo?.about;
  return (
    <Fragment>
      <Typography variant="h2">{aboutTranslations("title")}</Typography>
      {presentationInfo?.presentationVideo && (
        <Box
          sx={{
            height: "50vh",
            width: "100%",
          }}
        >
          <Media
            video={{
              threshold: 0.9,
              muted: false,
              controls: true,
              controlsList:
                "play volume fullscreen nodownload noplaybackrate notimeline",
              disablePictureInPicture: true,
              src: presentationInfo.presentationVideo,
            }}
          />
        </Box>
      )}
      <Typography>
        {noAboutInfo ? aboutTranslations("none") : presentationInfo.about}
      </Typography>
    </Fragment>
  );
};

const InitiativeProfile = () => {
  const [initiative] = useCurrentInitiative();
  const [myInitiative] = useMyInitiative();
  const initiativeTypeLabel = useInitiativeTypeLabel(initiative);
  return initiative ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", pb: 2 }}
    >
      <Typography variant="h1">{initiative.name}</Typography>
      <RatingsStack ratings={initiative.ratings} />
      <Avatar src={initiative.pic} sx={{ width: 225, height: 225 }} />
      <Typography>{initiativeTypeLabel}</Typography>
      <AboutSection initiative={initiative} />
      <Stack sx={{ width: "100%" }}>
        {initiative.type == "organization" &&
          initiative.organizationType == "incubator" && <IncubatorSection />}
        <Sponsorships
          showAmount={myInitiative && myInitiative?.id == initiative?.id}
        />
      </Stack>
    </Stack>
  ) : (
    <CircularProgress />
  );
};

const InitiativeContent = () => {
  const [actions] = useCurrentActions();
  const [socialProofs] = useCurrentImpacts();
  const [actionsContent, setActionsContent] = useState<Content[]>([]);
  const [socialProofsContent, setSocialProofsContent] = useState<Content[]>([]);
  const [content, setContent] = useState<Content[]>([]);

  useEffect(() => {
    if (actions && actions.length > 0) {
      setActionsContent(
        actions.map((action) => ({
          type: "action",
          data: action,
          createdAt: action.createdAt ? action.createdAt : moment().toDate(),
        }))
      );
    }
  }, [actions, setActionsContent]);
  useEffect(() => {
    if (socialProofs && socialProofs.length > 0) {
      setSocialProofsContent(
        socialProofs.map((socialProof) => ({
          type: "impact",
          data: socialProof,
          createdAt: socialProof.createdAt
            ? socialProof.createdAt
            : moment().toDate(),
        }))
      );
    }
  }, [socialProofs, setSocialProofsContent]);

  useEffect(() => {
    setContent(
      [...actionsContent, ...socialProofsContent].sort(
        (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
      )
    );
  }, [actionsContent, socialProofsContent, setContent]);

  return (
    <Grid container spacing={1}>
      {content.map((c, idx) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          key={c.data.id ? c.data.id : idx}
        >
          {c.type == "action" ? (
            <ImpactCard posiData={c.data} />
          ) : (
            <SocialProofCard socialProof={c.data} showInitiative={false} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

const VipDialog = ({
  open,
  setOpen,
  setSolicitDialogOpen,
  myInitiative,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSolicitDialogOpen: Dispatch<SetStateAction<boolean>>;
  myInitiative: Maker;
}) => {
  const vipDialogTranslations = useTranslations("initiatives.vip.dialog");
  const [actions] = useCurrentActions();
  const [socialProofs] = useCurrentImpacts();
  const vipState = useVipState(myInitiative, socialProofs, actions);
  return (
    <Dialog open={open}>
      <DialogTitle>{vipDialogTranslations("title")}</DialogTitle>
      <DialogContent>
        <Typography>{vipDialogTranslations("startProcessPrompt")}</Typography>
        <List>
          <ListItemButton href="/posi/upload" disabled={vipState.oneActionDone}>
            <ListItemIcon>
              {vipState.oneActionDone ? <CheckBox /> : <CheckBoxOutlineBlank />}
            </ListItemIcon>
            <ListItemText
              primary={vipDialogTranslations("oneActionDone.primary")}
              secondary={vipDialogTranslations("oneActionDone.secondary")}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              setOpen(false);
              setSolicitDialogOpen(true);
            }}
            disabled={vipState.enoughSocialProof}
          >
            <ListItemIcon>
              {vipState.enoughSocialProof ? (
                <CheckBox />
              ) : (
                <CheckBoxOutlineBlank />
              )}
            </ListItemIcon>
            <ListItemText
              primary={vipDialogTranslations("getThreeTestimonials.primary")}
              secondary={vipDialogTranslations(
                "getThreeTestimonials.secondary",
                { numSocialProofsDone: vipState.numSocialProofsDoneForVIP }
              )}
            />
          </ListItemButton>
          <ListItemButton
            href={`/initiatives/${myInitiative.id}/edit`}
            disabled={vipState.allFieldsFinished}
          >
            <ListItemIcon>
              {vipState.allFieldsFinished ? (
                <CheckBox />
              ) : (
                <CheckBoxOutlineBlank />
              )}
            </ListItemIcon>
            <ListItemText
              primary={vipDialogTranslations("finishInitiativeProfile.primary")}
              secondary={
                vipState.allFieldsFinished
                  ? vipDialogTranslations(
                      "finishInitiativeProfile.secondary.finished"
                    )
                  : vipDialogTranslations(
                      "finishInitiativeProfile.secondary.missingTheseFields",
                      { fields: vipState.unfinishedFields!.join(", ") }
                    )
              }
            />
          </ListItemButton>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const IncubateeVIPDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClose = () => setOpen(false);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Ahora eres parte de un grupo de élite. OneWe está trabajando con la
        incubadora para crear la mejor experiencia para los incubados.
      </DialogTitle>
      <DialogContent>
        <UnderConstruction />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BottomBar = () => {
  const bottomBarTranslations = useTranslations("initiatives.bottomBar");
  const callToActionTranslations = useTranslations("common.callToAction");
  const [initiative] = useCurrentInitiative();
  const [myInitiative] = useMyInitiative();
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  const router = useRouter();
  const { vipDialogOpen: queryVipDialogOpen } = router.query;
  const [vipDialogOpen, setVipDialogOpen] = useState(
    Boolean(queryVipDialogOpen)
  );
  const [incubateeVIPDialogOpen, setIncubateeVIPDialogOpen] = useState(false);
  const [socialProofs] = useCurrentImpacts();
  const [actions] = useCurrentActions();
  const vipState = useVipState(myInitiative, socialProofs, actions);
  const vipButtonBehavior = initiative?.incubator
    ? { onClick: () => setIncubateeVIPDialogOpen(true) }
    : vipState.entryGiven
    ? { href: "/initiatives/vip" }
    : { onClick: () => setVipDialogOpen(true) };

  const VipCenterBottomFab = () => (
    <CenterBottomFab color="secondary" {...vipButtonBehavior}>
      <Typography fontSize={25}>👑</Typography>
      <Typography fontSize={12}>{bottomBarTranslations("vip")}</Typography>
    </CenterBottomFab>
  );

  const IncubatorInviteInitiativeCenterBottomFab = ({
    initiative,
  }: {
    initiative: Maker;
  }) => (
    <CenterBottomFab
      color="secondary"
      href={`/initiatives/${initiative.id}/invite`}
    >
      <PersonAdd />
      <Typography fontSize={12}>{bottomBarTranslations("invite")}</Typography>
    </CenterBottomFab>
  );
  const presentationInfo = useLocalizedPresentationInfo(initiative);
  return initiative == undefined ? (
    <CenterBottomCircularProgress />
  ) : myInitiative && myInitiative.id == initiative.id ? (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SolicitDialog
        open={solicitDialogOpen}
        setOpen={setSolicitDialogOpen}
        howToSupport={
          presentationInfo?.howToSupport ? presentationInfo?.howToSupport : {}
        }
        solicitOpinionPath={`/initiatives/${initiative.id}/impact/upload`}
        pathUnderSupport={`/initiatives/${initiative.id}`}
        editInitiativePath={`/initiatives/${initiative.id}/edit`}
      />
      <VipDialog
        open={vipDialogOpen}
        setOpen={setVipDialogOpen}
        setSolicitDialogOpen={setSolicitDialogOpen}
        myInitiative={myInitiative}
      />
      <IncubateeVIPDialog
        open={incubateeVIPDialogOpen}
        setOpen={setIncubateeVIPDialogOpen}
      />
      <Toolbar>
        <IconButtonWithLabel href={`/initiatives/${initiative.id}/edit`}>
          <Edit />
          <Typography>{callToActionTranslations("edit")}</Typography>
        </IconButtonWithLabel>
        <IconButtonWithLabel onClick={() => setSolicitDialogOpen(true)}>
          <SupportIcon />
          <Typography>
            {bottomBarTranslations("solicitSupportShort")}
          </Typography>
        </IconButtonWithLabel>
        {initiative?.organizationType == "incubator" ? (
          <IncubatorInviteInitiativeCenterBottomFab initiative={initiative} />
        ) : (
          <VipCenterBottomFab />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <ShareActionArea
          shareProps={{
            title: bottomBarTranslations("sharePrompt"),
            path: `initiatives/${initiative.id}`,
          }}
        >
          <IconButtonWithLabel>
            <Share />
            <Typography>{callToActionTranslations("share")}</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
        <IconButtonWithLabel href={`/posi/upload`}>
          <Add />
          <Typography>{bottomBarTranslations("addActionShort")}</Typography>
        </IconButtonWithLabel>
      </Toolbar>
    </AppBar>
  ) : (
    <SupportBottomBar beneficiary={{ initiative: initiative }} />
  );
};

const MakerPage = asOneWePage(() => {
  return (
    <Box mb={12}>
      <Stack p={2} divider={<Divider />}>
        <InitiativeProfile />
        <InitiativeContent />
      </Stack>
      <BottomBar />
    </Box>
  );
});

export default MakerPage;
