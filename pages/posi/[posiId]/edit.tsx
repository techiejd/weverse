import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppState, AppState } from "../../../common/context/appState";
import PosiForm from "../../../modules/posi/form";
import {
  PosiFormData,
  posiFormData,
  posiFormDataConverter,
} from "../../../modules/posi/input/context";
import { doc, setDoc } from "firebase/firestore";
import { identity, pickBy } from "lodash";
import { useDocumentData } from "react-firebase-hooks/firestore";

const Edit = () => {
  const appState = useAppState();
  const router = useRouter();
  const { posiId } = router.query;
  const EditContent = ({ appState }: { appState: AppState }) => {
    const [user, loading, error] = useAuthState(appState.auth);
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
        router.push(`/posi/${posiId}/about`);
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
          <PosiForm
            appState={appState}
            onSubmit={onSubmit}
            user={user}
            initialPosi={posi}
          />
        ) : (
          <CircularProgress />
        )}
      </Stack>
    );
  };

  return appState ? <EditContent appState={appState} /> : <CircularProgress />;
};
export default Edit;
