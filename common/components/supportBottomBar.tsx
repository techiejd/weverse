import Share from "@mui/icons-material/Share";
import ConnectWithoutContact from "@mui/icons-material/ConnectWithoutContact";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Campaign from "@mui/icons-material/Campaign";
import Add from "@mui/icons-material/Add";
import VolunteerActivism from "@mui/icons-material/VolunteerActivism";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Stack,
  AppBar,
  Box,
  Toolbar,
} from "@mui/material";
import { Dispatch, Fragment, SetStateAction, use, useState } from "react";
import Linkify from "react-linkify";
import ShareActionArea, { ShareProps } from "./shareActionArea";
import { useRouter } from "next/router";
import { z } from "zod";
import {
  HowToSupport,
  Initiative,
  initiative,
  posiFormData,
} from "../../functions/shared/src";
import IconButtonWithLabel from "./iconButtonWithLabel";
import CenterBottomFab from "./centerBottomFab";
import Sponsor from "../../modules/initiatives/sponsor";
import UnderConstruction from "../../modules/posi/underConstruction";
import { useTranslations } from "next-intl";
import { useLocalizedPresentationInfo } from "../utils/translations";
import { useMySponsorships } from "../../modules/members/context";

const supportDialogs = z.enum(["connect", "sponsor", "generic"]);
export type SupportDialogs = z.infer<typeof supportDialogs>;

const useOpenSupportDialog = () => {
  const router = useRouter();
  const { openSupport } = router.query;
  return router.isReady && openSupport
    ? supportDialogs.parse(openSupport)
    : undefined;
};

const SponsorDialog = ({
  open,
  setOpen,
  sponsoring,
  inAddSponsorshipExperience,
  setInAddSponsorshipExperience,
  beneficiary,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  sponsoring: boolean;
  inAddSponsorshipExperience: boolean;
  setInAddSponsorshipExperience: Dispatch<SetStateAction<boolean>>;
  beneficiary: Initiative;
}) => {
  const sponsorDialogTranslations = useTranslations("common.sponsorDialog");
  const inputTranslations = useTranslations("input");
  const handleClose = () => setOpen(false);
  return sponsoring && !inAddSponsorshipExperience ? (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{sponsorDialogTranslations("title")}</DialogTitle>
      <DialogContent>
        <Typography>
          {sponsorDialogTranslations("oneWeIsWorkingOnMakingAGoodExp")}
        </Typography>
        <UnderConstruction />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {inputTranslations("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <Sponsor
        exitButtonBehavior={{
          onClick: () => {
            setOpen(false);
            setInAddSponsorshipExperience(false);
          },
        }}
        beneficiary={beneficiary}
      />
    </Dialog>
  );
};

const ContactSupportDialog = ({
  open,
  setOpen,
  inputText,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  inputText?: string;
}) => {
  const handleClose = () => setOpen(false);
  const contactSupportDialogTranslations = useTranslations(
    "common.contactSupportDialog"
  );
  const title = !inputText
    ? contactSupportDialogTranslations("missingInfoTitle")
    : contactSupportDialogTranslations("title");
  const text = inputText
    ? inputText
    : contactSupportDialogTranslations("missingInfoText");
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Linkify>{text}</Linkify>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GenericSupportDialog = ({
  open,
  setSponsorDialogOpen,
  setConnectDialogOpen,
  howToSupport,
  shareProps,
  addSocialProofPath,
}: {
  open: boolean;
  setSponsorDialogOpen: Dispatch<SetStateAction<boolean>>;
  setConnectDialogOpen: Dispatch<SetStateAction<boolean>>;
  howToSupport: HowToSupport;
  shareProps: ShareProps;
  addSocialProofPath: string;
}) => {
  const [o, setO] = useState(open);
  const handleClose = () => setO(false);
  const callToActionTranslations = useTranslations("common.callToAction");
  const supportDialogTranslations = useTranslations("common.supportDialog");
  const inputTranslations = useTranslations("input");
  return (
    <Dialog open={o} onClose={handleClose}>
      <DialogTitle>{supportDialogTranslations("title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {/** Speak, Fund, Contact, Share */}
          <Button
            href={addSocialProofPath}
            startIcon={<Campaign />}
            variant="outlined"
          >
            {callToActionTranslations("testify")}
          </Button>
          <Button
            onClick={() => {
              setSponsorDialogOpen(true);
              handleClose();
            }}
            startIcon={<CardGiftcard />}
            variant="outlined"
          >
            {callToActionTranslations("sponsor")}
          </Button>
          {howToSupport.contact && (
            <Button
              onClick={() => {
                setConnectDialogOpen(true);
                handleClose();
              }}
              startIcon={<ConnectWithoutContact />}
              variant="outlined"
            >
              {callToActionTranslations("connect")}
            </Button>
          )}
          <ShareActionArea shareProps={shareProps}>
            <Button
              onClick={() => handleClose()}
              startIcon={<Share />}
              variant="outlined"
            >
              {callToActionTranslations("share")}
            </Button>
          </ShareActionArea>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {inputTranslations("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const beneficiaryType = z.object({
  initiative,
  action: posiFormData.optional(),
});
type Beneficiary = z.infer<typeof beneficiaryType>;
const SupportBottomBar = ({ beneficiary }: { beneficiary: Beneficiary }) => {
  // TODO(techiejd): Missing button for connect to initiative (generic support dialog has it).
  const openSupportDialog = useOpenSupportDialog();
  const genericDialogOpen = openSupportDialog == "generic";
  const [connectDialogOpen, setConnectDialogOpen] = useState(
    openSupportDialog == "connect"
  );
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(
    openSupportDialog == "sponsor"
  );
  const callToActionTranslations = useTranslations("common.callToAction");
  const supportDialogTranslations = useTranslations("common.supportDialog");

  const addSocialProofPath = beneficiary.action
    ? `/${beneficiary.action.path}/testimonials/upload`
    : `/${beneficiary.initiative.path}/testimonials/upload`;

  const shareProps = {
    title: supportDialogTranslations("share", {
      beneficiaryType: beneficiary.action ? "action" : "initiative",
    }),
    path: beneficiary.action
      ? `/${beneficiary.action.path}`
      : `/${beneficiary.initiative.path}`,
  };

  const [sponsorships] = useMySponsorships();
  const sponsoring = sponsorships
    ? sponsorships.some(
        (s) =>
          s.initiative == beneficiary.initiative.path && !!s.paymentsStarted
      )
    : false;
  const [inAddSponsorshipExperience, setInAddSponsorshipExperience] =
    useState(false);

  const SponsorCallToAction = () => {
    return sponsoring ? (
      <Fragment>
        <Typography fontSize={25}>👑</Typography>
        <Typography fontSize={12}>VIP</Typography>
      </Fragment>
    ) : (
      <Fragment>
        <VolunteerActivism fontSize="large" />
        <Typography fontSize={12}>
          {callToActionTranslations("sponsor")}
        </Typography>
      </Fragment>
    );
  };

  const initiativePresentationInfo = useLocalizedPresentationInfo(
    beneficiary.initiative
  );

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SponsorDialog
        open={sponsorDialogOpen}
        setOpen={setSponsorDialogOpen}
        sponsoring={sponsoring}
        inAddSponsorshipExperience={inAddSponsorshipExperience}
        setInAddSponsorshipExperience={setInAddSponsorshipExperience}
        beneficiary={beneficiary.initiative}
      />
      <ContactSupportDialog
        open={connectDialogOpen}
        setOpen={setConnectDialogOpen}
        inputText={initiativePresentationInfo?.howToSupport?.contact}
      />
      <GenericSupportDialog
        open={genericDialogOpen}
        setSponsorDialogOpen={setSponsorDialogOpen}
        setConnectDialogOpen={setConnectDialogOpen}
        howToSupport={
          initiativePresentationInfo?.howToSupport
            ? initiativePresentationInfo.howToSupport
            : {}
        }
        shareProps={shareProps}
        addSocialProofPath={addSocialProofPath}
      />
      <Toolbar>
        <IconButtonWithLabel href={addSocialProofPath}>
          <Campaign fontSize="large" />
          <Typography fontSize={12}>
            {callToActionTranslations("testify")}
          </Typography>
        </IconButtonWithLabel>
        {beneficiary.initiative.connectedAccount?.status == "active" &&
          (!beneficiary.initiative.incubator?.connectedAccount ||
            beneficiary.initiative.incubator?.connectedAccount ==
              "allAccepted") && (
            <CenterBottomFab
              color="secondary"
              aria-label="add"
              sx={{ width: 70, height: 70 }}
              onClick={() => {
                //TODO(techiejd): Honestly posi should be under initiatives/initiativePath/posi.
                setSponsorDialogOpen(true);
                if (!sponsoring) setInAddSponsorshipExperience(true);
              }}
            >
              <SponsorCallToAction />
            </CenterBottomFab>
          )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButtonWithLabel onClick={() => setConnectDialogOpen(true)}>
          <Add fontSize="large" />
          <Typography fontSize={12}>
            {callToActionTranslations("support")}
          </Typography>
        </IconButtonWithLabel>
        <ShareActionArea shareProps={shareProps}>
          <IconButtonWithLabel>
            <Share fontSize="large" />
            <Typography fontSize={12}>
              {callToActionTranslations("share")}
            </Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
      </Toolbar>
    </AppBar>
  );
};

export default SupportBottomBar;
