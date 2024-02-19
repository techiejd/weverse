import Edit from "@mui/icons-material/Edit";
import { default as SupportIcon } from "@mui/icons-material/Support";
import Share from "@mui/icons-material/Share";
import Add from "@mui/icons-material/Add";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { Typography, AppBar, Toolbar, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";
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
import { Initiative } from "../../../functions/shared/src";
import {
  useCurrentInitiative,
  useCurrentTestimonials,
  useCurrentActions,
} from "../context";
import VipDialog from "./vipDialog";
import IncubateeVipDialog from "./incubateVipDialog";

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

  const VipCenterBottomFab = () => (
    <CenterBottomFab color="secondary" {...vipButtonBehavior}>
      <Typography fontSize={25}>👑</Typography>
      <Typography fontSize={12}>{bottomBarTranslations("vip")}</Typography>
    </CenterBottomFab>
  );

  const IncubatorInviteInitiativeCenterBottomFab = ({
    initiative,
  }: {
    initiative: Initiative;
  }) => (
    <CenterBottomFab color="secondary" href={`/${initiative.path}/invite`}>
      <PersonAdd />
      <Typography fontSize={12}>{bottomBarTranslations("invite")}</Typography>
    </CenterBottomFab>
  );
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
          <IncubatorInviteInitiativeCenterBottomFab initiative={initiative} />
        ) : (
          <VipCenterBottomFab />
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
