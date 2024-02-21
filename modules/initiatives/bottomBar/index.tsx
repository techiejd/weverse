import Edit from "@mui/icons-material/Edit";
import { default as SupportIcon } from "@mui/icons-material/Support";
import Share from "@mui/icons-material/Share";
import Add from "@mui/icons-material/Add";
import PersonAdd from "@mui/icons-material/PersonAdd";
import {
  Typography,
  AppBar,
  Toolbar,
  Box,
  FabProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import CenterBottomCircularProgress from "../../../common/components/centerBottomCircularProgress";
import CenterBottomFab from "../../../common/components/centerBottomFab";
import IconButtonWithLabel from "../../../common/components/iconButtonWithLabel";
import ShareActionArea from "../../../common/components/shareActionArea";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import SupportBottomBar from "../../../common/components/supportBottomBar";
import {
  useMyInitiatives,
  useIsMine,
} from "../../../common/context/weverseUtils";
import { useLocalizedPresentationInfo } from "../../../common/utils/translations";
import { useVipState } from "../../../common/utils/vip";
import {
  useCurrentInitiative,
  useCurrentTestimonials,
  useCurrentActions,
} from "../context";
import VipDialog from "./vipDialog";
import IncubateeVipDialog from "./incubateVipDialog";

const VipCenterBottomFab = ({
  vipButtonBehavior,
}: {
  vipButtonBehavior: FabProps;
}) => {
  const bottomBarTranslations = useTranslations("initiatives.bottomBar");
  return (
    <CenterBottomFab color="secondary" {...vipButtonBehavior}>
      <Typography fontSize={25}>👑</Typography>
      <Typography fontSize={12}>{bottomBarTranslations("vip")}</Typography>
    </CenterBottomFab>
  );
};

const IncubatorInviteInitiativeMenuDialog = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const [initiative] = useCurrentInitiative();
  const router = useRouter();
  const shareIncubateeEntrancePortalPath = `${router.asPath}/incubateeEntrance`;
  return (
    <div>
      <Dialog open={open} onClose={close}>
        <DialogTitle>Invite</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              Most personalized option: send a customized link for the
              initiative(s). Perfect for when they have not joined OneWe yet.
              <Button href={`/${initiative?.path}/invite`} variant="contained">
                Invite individually
              </Button>
            </Stack>
            <Stack spacing={1}>
              Simplest option: share your incubator entrance portal. Perfect for
              when they have already joined OneWe.
              <ShareActionArea
                shareProps={{
                  title: "Join my incubator on OneWe",
                  path: shareIncubateeEntrancePortalPath,
                }}
              >
                <Button variant="contained">Share entrance portal</Button>
              </ShareActionArea>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

//href={`/${initiative.path}/invite`}

const IncubatorInviteInitiativeCenterBottomFab = () => {
  const bottomBarTranslations = useTranslations("initiatives.bottomBar");
  const [openInviteMenu, setOpenInviteMenu] = useState(false);
  return (
    <Fragment>
      <IncubatorInviteInitiativeMenuDialog
        open={openInviteMenu}
        close={() => setOpenInviteMenu(false)}
      />
      <CenterBottomFab
        color="secondary"
        onClick={() => setOpenInviteMenu(true)}
      >
        <PersonAdd />
        <Typography fontSize={12}>{bottomBarTranslations("invite")}</Typography>
      </CenterBottomFab>
    </Fragment>
  );
};

const BottomBar = () => {
  const bottomBarTranslations = useTranslations("initiatives.bottomBar");
  const callToActionTranslations = useTranslations("common.callToAction");
  const [initiative] = useCurrentInitiative();
  const [myInitiatives] = useMyInitiatives();
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  const router = useRouter();
  const { vipDialogOpen: queryVipDialogOpen } = router.query;
  const [vipDialogOpen, setVipDialogOpen] = useState(
    Boolean(queryVipDialogOpen)
  );
  const [incubateeVIPDialogOpen, setIncubateeVIPDialogOpen] = useState(false);
  const [socialProofs] = useCurrentTestimonials();
  const [actions] = useCurrentActions();
  const vipState = useVipState(myInitiatives?.[0], socialProofs, actions);
  const vipButtonBehavior = initiative?.incubator
    ? { onClick: () => setIncubateeVIPDialogOpen(true) }
    : vipState.entryGiven
    ? { href: "/initiatives/vip" }
    : { onClick: () => setVipDialogOpen(true) };
  const isMine = useIsMine();

  const presentationInfo = useLocalizedPresentationInfo(initiative);
  return initiative == undefined ? (
    <CenterBottomCircularProgress />
  ) : isMine ? (
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
        solicitOpinionPath={`${initiative.path}/testimonials/upload`}
        pathUnderSupport={`${initiative.path}`}
        editInitiativePath={`/${initiative.path}/edit`}
      />
      <VipDialog
        open={vipDialogOpen}
        setOpen={setVipDialogOpen}
        setSolicitDialogOpen={setSolicitDialogOpen}
        myInitiative={initiative}
      />
      <IncubateeVipDialog
        open={incubateeVIPDialogOpen}
        setOpen={setIncubateeVIPDialogOpen}
      />
      <Toolbar>
        <IconButtonWithLabel href={`/${initiative.path}/edit`}>
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
          <IncubatorInviteInitiativeCenterBottomFab />
        ) : (
          <VipCenterBottomFab vipButtonBehavior={vipButtonBehavior} />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <ShareActionArea
          shareProps={{
            title: bottomBarTranslations("sharePrompt"),
            path: `${initiative.path}`,
          }}
        >
          <IconButtonWithLabel>
            <Share />
            <Typography>{callToActionTranslations("share")}</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
        <IconButtonWithLabel href={`/${initiative.path}/actions/upload`}>
          <Add />
          <Typography>{bottomBarTranslations("addActionShort")}</Typography>
        </IconButtonWithLabel>
      </Toolbar>
    </AppBar>
  ) : (
    <SupportBottomBar beneficiary={{ initiative: initiative }} />
  );
};

export default BottomBar;
