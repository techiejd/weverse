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
  Maker,
  maker,
  posiFormData,
} from "../../functions/shared/src";
import IconButtonWithLabel from "./iconButtonWithLabel";
import CenterBottomFab from "./centerBottomFab";
import Sponsor from "../../modules/initiatives/sponsor";
import { useMyMember, useMySponsorships } from "../context/weverseUtils";
import UnderConstruction from "../../modules/posi/underConstruction";
import LogInPrompt from "./logInPrompt";
import { useTranslations } from "next-intl";
import { useLocalizedPresentationInfo } from "../utils/translations";

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
  beneficiary: Maker;
}) => {
  const sponsorDialogTranslations = useTranslations("common.sponsorDialog");
  const inputTranslations = useTranslations("input");
  const handleClose = () => setOpen(false);
  const [myMember] = useMyMember();
  if (!myMember) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <LogInPrompt
          title={sponsorDialogTranslations("logInPrompt")}
          setOpen={setOpen}
        />
      </Dialog>
    );
  }
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
  maker,
  action: posiFormData.optional(),
});
type Beneficiary = z.infer<typeof beneficiaryType>;
const SupportBottomBar = ({ beneficiary }: { beneficiary: Beneficiary }) => {
  // TODO(techiejd): Missing button for connect to maker (generic support dialog has it).
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
    ? `/posi/${beneficiary.action.id}/impact/upload`
    : `/initiatives/${beneficiary.maker.id}/impact/upload`;

  const shareProps = {
    title: supportDialogTranslations("share", {
      beneficiaryType: beneficiary.action ? "action" : "maker",
    }),
    path: beneficiary.action
      ? `/posi/${beneficiary.action.id}`
      : `/initiatives/${beneficiary.maker.id}`,
  };

  const [sponsorships] = useMySponsorships();
  const sponsoring = sponsorships
    ? sponsorships.some(
        (s) => s.maker == beneficiary.maker.id && !!s.paymentsStarted
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

  const makerPresentationInfo = useLocalizedPresentationInfo(beneficiary.maker);

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
        beneficiary={beneficiary.maker}
      />
      <ContactSupportDialog
        open={connectDialogOpen}
        setOpen={setConnectDialogOpen}
        inputText={makerPresentationInfo?.howToSupport?.contact}
      />
      <GenericSupportDialog
        open={genericDialogOpen}
        setSponsorDialogOpen={setSponsorDialogOpen}
        setConnectDialogOpen={setConnectDialogOpen}
        howToSupport={
          makerPresentationInfo?.howToSupport
            ? makerPresentationInfo.howToSupport
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
        <CenterBottomFab
          color="secondary"
          aria-label="add"
          sx={{ width: 70, height: 70 }}
          onClick={() => {
            //TODO(techiejd): Honestly posi should be under makers/makerId/posi.
            setSponsorDialogOpen(true);
            if (!sponsoring) setInAddSponsorshipExperience(true);
          }}
        >
          <SponsorCallToAction />
        </CenterBottomFab>
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
