import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { identity, pickBy } from "lodash";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../../../../../common/components/onewePage";
import { useAppState } from "../../../../../../../../common/context/appState";
import { usePosiFormDataConverter } from "../../../../../../../../common/utils/firebase";
import { CachePaths } from "../../../../../../../../common/utils/staticPaths";
import {
  WithTranslationsStaticProps,
  spreadTranslationsStaticProps,
  Locale2Messages,
} from "../../../../../../../../common/utils/translations";
import {
  PosiFormData,
  posiFormData,
} from "../../../../../../../../functions/shared/src";
import PosiForm from "../../../../../../../../modules/posi/action/form";
import { useCurrentPosi } from "../../../../../../../../modules/posi/context";
import { useCurrentInitiative } from "../../../../../../../../modules/initiatives/context";
import { useCallback } from "react";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps(
  spreadTranslationsStaticProps
);

const Edit = asOneWePage((locale2Messages: Locale2Messages) => {
  const editTranslations = useTranslations("actions.edit");
  const appState = useAppState();
  const router = useRouter();
  const [posi] = useCurrentPosi();
  const [initiative] = useCurrentInitiative();
  const posiDocRef =
    posi && posi?.path ? doc(appState.firestore, posi.path) : undefined;

  const onUpdate = async (usersPosi: PosiFormData) => {
    if (!posiDocRef || !posi?.path) {
      return;
    }
    const cleanedPosi = pickBy(usersPosi, identity);
    const parsedPosi = posiFormData.parse(cleanedPosi);
    await setDoc(posiDocRef, parsedPosi);
    router.push(posi.path);
  };

  const onDelete = useCallback(async () => {
    if (!initiative?.path || !posiDocRef) {
      return;
    }
    router.prefetch(initiative?.path);
    await deleteDoc(posiDocRef);
    router.push(initiative?.path);
  }, [initiative?.path, posiDocRef, router]);

  return (
    <Stack>
      <Stack
        spacing={1}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Typography variant="h1">{editTranslations("title")} 🤸 </Typography>
      </Stack>
      {posi ? (
        <PosiForm
          onInteraction={{ type: "update", onUpdate, onDelete }}
          initialPosi={posi}
          locale2Messages={locale2Messages}
        />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
});
export default Edit;
