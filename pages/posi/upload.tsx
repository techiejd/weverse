import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContentText,
  Stack,
  Typography,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import {
  PosiFormData,
  posiFormDataConverter,
} from "../../modules/posi/input/context";
import { AppState, useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";
import { useAuthState } from "react-firebase-hooks/auth";
import PosiForm from "../../modules/posi/action/form";

const LogInPrompt = () => {
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
        <Typography variant="h3">
          ¡Oh-oh! Primero se necesita iniciar sesión.
        </Typography>
        <DialogContentText>
          Regístrese si no lo has hecho. Inicia sesión si ya estás registrado.
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

const Upload = () => {
  const appState = useAppState();
  const router = useRouter();
  const UploadContent = ({ appState }: { appState: AppState }) => {
    const [user, loading, error] = useAuthState(appState.auth);
    const onSubmit = async (usersPosi: PosiFormData) => {
      if (appState) {
        const docRef = await addDoc(
          collection(appState.firestore, "impacts").withConverter(
            posiFormDataConverter
          ),
          usersPosi
        );
        router.push(`/posi/${docRef.id}/action`);
      }
    };
    return (
      <Stack>
        <Stack
          spacing={1}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign={"center"}
        >
          <Typography variant="h1">¡Publica tu acción! 🪧</Typography>
          <Typography>¡Hola, muchas gracias por estar aquí!</Typography>
          <Typography>
            Estamos creando un universo en el que le puedas mostrar al mundo
            todo lo bueno que estás haciendo por los demás, ¡porque vale la pena
            mostrarlo!
          </Typography>
          <Typography>
            Aquí amamos el impacto social, poder demostrar con datos los
            resultados de tus acciones sociales y brindarte el apoyo que
            necesites. Por ende, necesitamos que nos muestres la acción social
            -- Action -- para nosotros emitirlo a la comunidad y medir el
            impacto.
          </Typography>
          <Typography>
            De nuevo, gracias por querer compartirla con nuestra comunidad.
          </Typography>
        </Stack>
        {user ? (
          <PosiForm appState={appState} onSubmit={onSubmit} user={user} />
        ) : (
          <LogInPrompt />
        )}
      </Stack>
    );
  };

  return appState ? (
    <UploadContent appState={appState} />
  ) : (
    <CircularProgress />
  );
};

export default Upload;
