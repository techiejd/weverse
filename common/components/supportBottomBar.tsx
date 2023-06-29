import {
  Share,
  ConnectWithoutContact,
  CardGiftcard,
  Campaign,
  Add,
  VolunteerActivism,
} from "@mui/icons-material";
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
import Sponsor from "../../modules/makers/sponsor";
import { useMyMember, useMySponsorships } from "../context/weverseUtils";
import UnderConstruction from "../../modules/posi/underConstruction";
import LogInPrompt from "./logInPrompt";

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
  const handleClose = () => setOpen(false);
  const [myMember] = useMyMember();
  if (!myMember) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <LogInPrompt
          title={"Debes ser miembro registrado para poder patrocinar."}
          setOpen={setOpen}
        />
      </Dialog>
    );
  }
  return sponsoring && !inAddSponsorshipExperience ? (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Gracias por patrocinar. OneWe está trabajando con el/la Maker para crear
        la mejor experiencia de patrocinio.
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
  const title = !inputText
    ? "El o la Maker aún no ha terminado su perfil."
    : "El o la Maker dice que busca el siguiente tipo de ayuda y con estos canales de contacto:";
  const text = inputText
    ? inputText
    : `¡Gracias por querer apoyar! Le hemos mandado un mensaje al o la Maker de tu interes y esperamos que tu solicitud le anime a terminar pronto.`;
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
  return (
    <Dialog open={o} onClose={handleClose}>
      <DialogTitle>¡Gracias por tu apoyo!</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {/** Speak, Fund, Contact, Share */}
          <Button
            href={addSocialProofPath}
            startIcon={<Campaign />}
            variant="outlined"
          >
            Dar tu opinión
          </Button>
          <Button
            onClick={() => {
              setSponsorDialogOpen(true);
              handleClose();
            }}
            startIcon={<CardGiftcard />}
            variant="outlined"
          >
            Patrocinar
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
              Conectar
            </Button>
          )}
          <ShareActionArea shareProps={shareProps}>
            <Button
              onClick={() => handleClose()}
              startIcon={<Share />}
              variant="outlined"
            >
              Compartir
            </Button>
          </ShareActionArea>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const beneficiaryType = z.object({
  maker: maker,
  action: posiFormData.optional(),
});
type Beneficiary = z.infer<typeof beneficiaryType>;
const SupportBottomBar = ({ beneficiary }: { beneficiary: Beneficiary }) => {
  const openSupportDialog = useOpenSupportDialog();
  const genericDialogOpen = openSupportDialog == "generic";
  const [connectDialogOpen, setConnectDialogOpen] = useState(
    openSupportDialog == "connect"
  );
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(
    openSupportDialog == "sponsor"
  );

  const addSocialProofPath = beneficiary.action
    ? `/posi/${beneficiary.action.id}/impact/upload`
    : `/makers/${beneficiary.maker.id}/impact/upload`;

  const shareProps = beneficiary.action
    ? {
        title: "Mira esta acción social tan chévere. ¡Apoyemosla!",
        text: "Mira esta acción social tan chévere. ¡Apoyemosla!",
        path: `/posi/${beneficiary.action.id}`,
      }
    : {
        title: "Mira esta Maker tan chévere. ¡Apoyemosla!",
        text: "Mira esta Maker tan chévere. ¡Apoyemosla!",
        path: `/makers/${beneficiary.maker.id}`,
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
        <Typography fontSize={12}>Patrocinar</Typography>
      </Fragment>
    );
  };

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
        inputText={beneficiary.maker.howToSupport?.contact}
      />
      <GenericSupportDialog
        open={genericDialogOpen}
        setSponsorDialogOpen={setSponsorDialogOpen}
        setConnectDialogOpen={setConnectDialogOpen}
        howToSupport={
          beneficiary.maker.howToSupport ? beneficiary.maker.howToSupport : {}
        }
        shareProps={shareProps}
        addSocialProofPath={addSocialProofPath}
      />
      <Toolbar>
        <IconButtonWithLabel href={addSocialProofPath}>
          <Campaign fontSize="large" />
          <Typography fontSize={12}>Dar Testimonio</Typography>
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
          <Typography fontSize={12}>Apoyar</Typography>
        </IconButtonWithLabel>
        <ShareActionArea shareProps={shareProps}>
          <IconButtonWithLabel>
            <Share fontSize="large" />
            <Typography fontSize={12}>Compartir</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
      </Toolbar>
    </AppBar>
  );
};

export default SupportBottomBar;
