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
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Linkify from "react-linkify";
import SharingSpeedDialAction from "../../modules/makers/sharingSpeedDialAction";
import { HowToSupport } from "../context/weverse";
import { ShareProps } from "./shareActionArea";

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

const Support = ({
  howToSupport,
  shareProps,
  addSocialProofPath,
}: {
  howToSupport: HowToSupport;
  shareProps: ShareProps;
  addSocialProofPath: string;
}) => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = useState(false);

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
        key="Vociferar"
        icon={
          <Link href={addSocialProofPath} style={{ textDecoration: "none" }}>
            <Campaign />
          </Link>
        }
        tooltipTitle={
          <Link href={addSocialProofPath} style={{ textDecoration: "none" }}>
            Vociferar
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
          title="El o la Maker dice que puede financiarlos de las siguientes maneras:"
          text={howToSupport!.contact}
        />
      )}
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
