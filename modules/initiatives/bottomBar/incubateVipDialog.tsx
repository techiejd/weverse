import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import UnderConstruction from "../../posi/underConstruction";

const IncubateeVipDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClose = () => setOpen(false);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Ahora eres parte de un grupo de élite. OneWe está trabajando con la
        incubadora para crear la mejor experiencia para los incubados.
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
  );
};

export default IncubateeVipDialog;
