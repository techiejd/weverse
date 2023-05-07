import {
  Box,
  Stack,
  Typography,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";

const LogInPrompt = ({ title }: { title: string }) => {
  const [logInDialogOpen, setLogInDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  return (
    <Box border={1} borderColor={"black"} p={2} m={2}>
      <AuthDialog open={logInDialogOpen} setOpen={setLogInDialogOpen} />
      <AuthDialog
        open={registerDialogOpen}
        setOpen={setRegisterDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      <Stack alignItems={"center"} justifyItems={"center"}>
        <Typography variant="h3">{title}</Typography>
        <DialogContentText>
          Regístrate si no lo has hecho. Inicia sesión si ya estás registrado.
        </DialogContentText>
        <DialogActions>
          <Button href="/" size="small">
            Cancelar
          </Button>
          <AuthDialogButton setAuthDialogOpen={setLogInDialogOpen} />
          <AuthDialogButton
            setAuthDialogOpen={setRegisterDialogOpen}
            authAction={AuthAction.register}
            buttonVariant="contained"
          />
        </DialogActions>
      </Stack>
    </Box>
  );
};

export default LogInPrompt;
