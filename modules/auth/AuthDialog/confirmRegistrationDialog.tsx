import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Login } from "@mui/icons-material";
import { AuthDialogState } from "./context";
import { organizationLabels } from "../../../common/context/weverse";

const ConfirmRegistrationDialog = ({
  authDialogState,
  setAuthDialogState,
  confirm,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
  confirm: () => void;
}) => {
  return (
    <Dialog open={authDialogState.confirmRegistrationDialogOpen}>
      <DialogTitle>Revisa la información:</DialogTitle>
      <DialogContent>
        <Typography>
          <b>Nombre: </b>
          {authDialogState.name}
        </Typography>
        <Stack>
          {authDialogState.maker && [
            <Typography key="maker-section-title">
              <b>Maker:</b>
            </Typography>,
            <Stack
              ml={2}
              mr={2}
              key="maker-section-content"
              alignItems={"center"}
            >
              <Avatar src={authDialogState.maker.pic} />
              <Typography>
                {authDialogState.maker.type == "individual"
                  ? "Individual"
                  : authDialogState.maker.name}
              </Typography>
              {authDialogState.maker.type == "organization" &&
                authDialogState.maker.organizationType && (
                  <Typography>
                    {organizationLabels[authDialogState.maker.organizationType]}
                  </Typography>
                )}
            </Stack>,
          ]}
          <Typography>
            <b>Número telefónico:</b>{" "}
            {`+${authDialogState.phoneNumber.countryCallingCode} ${authDialogState.phoneNumber.nationalNumber}`}
          </Typography>
          <Typography>
            Vas a recibir un codigo de verificación a este número.
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
              confirmRegistrationDialogOpen: false,
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

export default ConfirmRegistrationDialog;
