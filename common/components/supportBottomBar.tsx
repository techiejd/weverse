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
import { Dispatch, SetStateAction, useState } from "react";
import Linkify from "react-linkify";
import ShareActionArea, { ShareProps } from "./shareActionArea";
import { useRouter } from "next/router";
import { z } from "zod";
import { HowToSupport, maker, posiFormData } from "../../functions/shared/src";
import IconButtonWithLabel from "./iconButtonWithLabel";
import CenterBottomFab from "./centerBottomFab";

const supportDialogs = z.enum(["connect", "finance", "generic"]);
export type SupportDialogs = z.infer<typeof supportDialogs>;

const useOpenSupportDialog = () => {
  const router = useRouter();
  const { openSupport } = router.query;
  return router.isReady && openSupport
    ? supportDialogs.parse(openSupport)
    : undefined;
};

const SupportDialog = ({
  open,
  setOpen,
  inputText,
  type,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  inputText?: string;
  type: "contact" | "finance";
}) => {
  const handleClose = () => setOpen(false);
  const title = !inputText
    ? "El o la Maker aún no ha terminado su perfil."
    : type == "contact"
    ? "El o la Maker dice que busca el siguiente tipo de ayuda y con estos canales de contacto:"
    : "El o la Maker dice que puede financiarlos de las siguientes maneras:";
  const text = inputText
    ? inputText
    : `¡Gracias por querer ${
        type == "contact" ? "apoyar" : "contribuir"
      }! Le hemos mandado un mensaje al o la Maker de tu interes y esperamos que tu solicitud le anime a terminar pronto.`;
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
  setFinanceDialogOpen,
  setConnectDialogOpen,
  howToSupport,
  shareProps,
  addSocialProofPath,
}: {
  open: boolean;
  setFinanceDialogOpen: Dispatch<SetStateAction<boolean>>;
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
          {howToSupport.finance && (
            <Button
              onClick={() => {
                setFinanceDialogOpen(true);
                handleClose();
              }}
              startIcon={<CardGiftcard />}
              variant="outlined"
            >
              Financiar
            </Button>
          )}
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
  const [financeDialogOpen, setFinanceDialogOpen] = useState(
    openSupportDialog == "finance"
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
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SupportDialog
        open={financeDialogOpen}
        setOpen={setFinanceDialogOpen}
        inputText={beneficiary.maker.howToSupport?.finance}
        type="finance"
      />
      <SupportDialog
        open={connectDialogOpen}
        setOpen={setConnectDialogOpen}
        inputText={beneficiary.maker.howToSupport?.contact}
        type="contact"
      />
      <GenericSupportDialog
        open={genericDialogOpen}
        setFinanceDialogOpen={setFinanceDialogOpen}
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
        >
          <IconButtonWithLabel onClick={() => setFinanceDialogOpen(true)}>
            <VolunteerActivism fontSize="large" />
            <Typography fontSize={12}>Contribuir</Typography>
          </IconButtonWithLabel>
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
