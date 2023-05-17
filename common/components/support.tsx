import {
  Share,
  ConnectWithoutContact,
  CardGiftcard,
  Handshake,
  Campaign,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  SpeedDial,
  Typography,
  SpeedDialAction,
  Link,
  Stack,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Linkify from "react-linkify";
import SharingSpeedDialAction from "../../modules/makers/sharingSpeedDialAction";
import ShareActionArea, { ShareProps } from "./shareActionArea";
import { useRouter } from "next/router";
import { z } from "zod";
import { HowToSupport } from "shared";

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
  title,
  text,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  text: string;
}) => {
  const handleClose = () => setOpen(false);
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

const Support = ({
  howToSupport,
  shareProps,
  addSocialProofPath,
}: {
  howToSupport: HowToSupport;
  shareProps: ShareProps;
  addSocialProofPath: string;
}) => {
  const openSupportDialog = useOpenSupportDialog();
  const [connectDialogOpen, setConnectDialogOpen] = useState(
    openSupportDialog == "connect"
  );
  const [financeDialogOpen, setFinanceDialogOpen] = useState(
    openSupportDialog == "finance"
  );
  const genericDialogOpen = openSupportDialog == "generic";

  const actions = (() => {
    const actions = [
      <SharingSpeedDialAction
        key={"Compartir"}
        icon={<Share />}
        tooltipTitle={"Compartir"}
        tooltipOpen
        {...shareProps}
      />,
      <SpeedDialAction
        key="Dar opinión"
        icon={
          <Link href={addSocialProofPath} style={{ textDecoration: "none" }}>
            <Campaign />
          </Link>
        }
        tooltipTitle={
          <Link href={addSocialProofPath} style={{ textDecoration: "none" }}>
            Dar opinión
          </Link>
        }
        tooltipOpen
      />,
    ];
    if (howToSupport?.contact) {
      actions.unshift(
        <SpeedDialAction
          key={"Conectar"}
          icon={<ConnectWithoutContact />}
          tooltipTitle={"Conectar"}
          tooltipOpen
          onClick={() => setConnectDialogOpen(true)}
        />
      );
    }
    if (howToSupport?.finance) {
      actions.unshift(
        <SpeedDialAction
          key={"Financiar"}
          icon={<CardGiftcard />}
          tooltipTitle={"Financiar"}
          tooltipOpen
          onClick={() => setFinanceDialogOpen(true)}
        />
      );
    }
    return actions;
  })();
  return (
    <div>
      {howToSupport?.finance && (
        <SupportDialog
          open={financeDialogOpen}
          setOpen={setFinanceDialogOpen}
          title="El o la Maker dice que puede financiarlos de las siguientes maneras:"
          text={howToSupport!.finance}
        />
      )}
      {howToSupport?.contact && (
        <SupportDialog
          open={connectDialogOpen}
          setOpen={setConnectDialogOpen}
          title="El o la Maker dice que busca el siguiente tipo de ayuda y con estos canales de contacto:"
          text={howToSupport!.contact}
        />
      )}
      <GenericSupportDialog
        open={genericDialogOpen}
        setFinanceDialogOpen={setFinanceDialogOpen}
        setConnectDialogOpen={setConnectDialogOpen}
        howToSupport={howToSupport}
        shareProps={shareProps}
        addSocialProofPath={addSocialProofPath}
      />
      <SpeedDial
        ariaLabel="Support"
        sx={{
          position: "fixed",
          bottom: 64,
          right: 16,
        }}
        icon={
          <div>
            <Handshake />
            <Typography fontSize={8} mt={-1}>
              Soportar
            </Typography>
          </div>
        }
      >
        {actions}
      </SpeedDial>
    </div>
  );
};

export default Support;
