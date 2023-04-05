import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Login } from "@mui/icons-material";
import { AuthDialogState } from "./context";

const RegisterConfirmDialog = ({
  authDialogState,
  setAuthDialogState,
  confirm,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
  confirm: () => void;
}) => {
  return (
    <Dialog open={authDialogState.registerConfirmDialogOpen}>
      <DialogTitle>Por favor revisar la información.</DialogTitle>
      <DialogContent>
        <Typography>
          <b>Nombre:</b>
        </Typography>
        <Stack>
          <Typography>
            <b>Maker:</b>
          </Typography>
          <Stack ml={2} mr={2}>
            <Typography>MakerType</Typography>
          </Stack>
          <Typography>
            <b>Número telefónico:</b>
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={(e) => {
            setAuthDialogState((aDS) => ({
              ...aDS,
              registerConfirmDialogOpen: false,
            }));
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          endIcon={<Login />}
          onClick={(e) => {
            confirm();
          }}
        >
          Listo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterConfirmDialog;
