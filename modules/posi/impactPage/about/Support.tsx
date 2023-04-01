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
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useImpactPageContext } from "../context";
import Linkify from "react-linkify";
import { HowToSupport } from "../../input/context";

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

const Support = ({ howToSupport }: { howToSupport: HowToSupport }) => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = useState(false);
  const impactPageContext = useImpactPageContext();
  const actions = (() => {
    const actions = [
      {
        icon: <Share />,
        name: "Compartir",
        onClick: () => {
          impactPageContext?.launchShare();
        },
      },
    ];
    // It renders in backwards order lmao.
    if (howToSupport?.contact) {
      actions.unshift({
        icon: <ConnectWithoutContact />,
        name: "Conectar",
        onClick: () => setConnectDialogOpen(true),
      });
    }
    if (howToSupport?.finance) {
      actions.unshift({
        icon: <CardGiftcard />,
        name: "Financiar",
        onClick: () => setFinanceDialogOpen(true),
      });
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
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default Support;
