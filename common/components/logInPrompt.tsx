import {
  Box,
  Stack,
  Typography,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";

const LogInPrompt = ({
  title,
  setOpen,
}: {
  title: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [logInDialogOpen, setLogInDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const behavior = setOpen
    ? {
        onClick: () => {
          setOpen(false);
        },
      }
    : { href: "/" };
  return (
    <Box
      sx={{
        border: 1,
        p: 2,
        m: 2,
        backgroundColor: "#f5f8ff",
        borderRadius: 2,
        borderColor: "#d9e1ec",
      }}
    >
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
          <Button {...behavior} size="small">
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
