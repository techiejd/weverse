import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { identity, pickBy } from "lodash";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAppState } from "../../../../common/context/appState";
import PosiForm from "../../../../modules/posi/action/form";
import { posiFormDataConverter } from "../../../../common/utils/firebase";
import { PosiFormData, posiFormData } from "../../../../functions/shared/src";
import { useCurrentPosiId } from "../../../../modules/posi/context";
import { useEffect } from "react";

const Edit = () => {
  const appState = useAppState();
  const router = useRouter();
  const posiId = useCurrentPosiId();
  const posiDocRef = doc(
    appState.firestore,
    "impacts",
    String(posiId)
  ).withConverter(posiFormDataConverter);
  const [posi, posiLoading, posiError] = useDocumentData(posiDocRef);

  const onUpdate = async (usersPosi: PosiFormData) => {
    const cleanedPosi = pickBy(usersPosi, identity);
    const parsedPosi = posiFormData.parse(cleanedPosi);
    await setDoc(posiDocRef, parsedPosi);
    router.push(`/posi/${posiId}`);
  };

  const onDelete = (p: PosiFormData) => {
    const makerRoute = `/makers/${p.makerId}`;

    router.prefetch(makerRoute);

    return async () => {
      await deleteDoc(posiDocRef);
      router.push(makerRoute);
    };
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
      {posi ? (
        <PosiForm
          onInteraction={{ type: "update", onUpdate, onDelete: onDelete(posi) }}
          initialPosi={posi}
        />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};
export default Edit;
