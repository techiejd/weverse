import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { identity, pickBy } from "lodash";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useAppState } from "../../../../common/context/appState";
import PosiForm from "../../../../modules/posi/action/form";
import { posiFormDataConverter } from "../../../../common/utils/firebase";
import { PosiFormData, posiFormData } from "../../../../functions/shared/src";
import { useCurrentPosiId } from "../../../../modules/posi/context";

const Edit = () => {
  const appState = useAppState();
  const router = useRouter();
  const posiId = useCurrentPosiId();
  const { user } = useAppState().authState;
  const posiDocRef = doc(
    appState.firestore,
    "impacts",
    String(posiId)
  ).withConverter(posiFormDataConverter);
  const [posi, posiLoading, posiError] = useDocumentData(posiDocRef);

  const onSubmit = async (usersPosi: PosiFormData) => {
    if (appState) {
      const cleanedPosi = pickBy(usersPosi, identity);
      const parsedPosi = posiFormData.parse(cleanedPosi);
      await setDoc(posiDocRef, parsedPosi);
      router.push(`/posi/${posiId}`);
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
        <Typography variant="h1">Edita tu acción. 🤸 </Typography>
      </Stack>
      {user && posi ? (
        <PosiForm onSubmit={onSubmit} user={user} initialPosi={posi} />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};
export default Edit;
