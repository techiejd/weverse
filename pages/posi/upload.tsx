import { CircularProgress, Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import {
  PosiFormData,
  posiFormDataConverter,
} from "../../modules/posi/input/context";
import { AppState, useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import PosiForm from "../../modules/posi/action/form";
import LogInPrompt from "../../common/components/logInPrompt";

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
        router.push(`/posi/${docRef.id}/impact/solicit`);
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
          <LogInPrompt
            title={"Para cargar una acción, debes ingresar al sistem."}
          />
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
