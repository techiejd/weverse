import {
  Share,
  ConnectWithoutContact,
  CardGiftcard,
  Handshake,
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
  SpeedDialActionProps,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Linkify from "react-linkify";
import { ShareProps } from "../../../../common/components/shareActionArea";
import SharingSpeedDialAction from "../../sharingSpeedDialAction";
import { HowToSupport } from "../../../../common/context/weverse";

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
}: {
  howToSupport: HowToSupport;
  shareProps: ShareProps;
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
