import { Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import PosiForm from "../../modules/posi/action/form";
import LogInPrompt from "../../common/components/logInPrompt";
import { posiFormDataConverter } from "../../common/utils/firebase";
import { PosiFormData } from "../../functions/shared/src";

const Upload = () => {
  const appState = useAppState();
  const router = useRouter();
  const UploadContent = () => {
    const { user } = useAppState().authState;
    const onSubmit = async (usersPosi: PosiFormData) => {
      const docRef = await addDoc(
        collection(appState.firestore, "impacts").withConverter(
          posiFormDataConverter
        ),
        usersPosi
      );
      router.push(`/posi/${docRef.id}/impact/solicit`);
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
        </Stack>
        {user ? (
          <PosiForm onInteraction={{ type: "create", onSubmit }} />
        ) : (
          <LogInPrompt
            title={"Para cargar una acción, debes ingresar al sistem."}
          />
        )}
      </Stack>
    );
  };

  return <UploadContent />;
};

export default Upload;
