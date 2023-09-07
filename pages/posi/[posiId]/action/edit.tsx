import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { identity, pickBy } from "lodash";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAppState } from "../../../../common/context/appState";
import PosiForm from "../../../../modules/posi/action/form";
import { usePosiFormDataConverter } from "../../../../common/utils/firebase";
import { PosiFormData, posiFormData } from "../../../../functions/shared/src";
import { useCurrentPosiId } from "../../../../modules/posi/context";
import {
  Locale2Messages,
  WithTranslationsStaticProps,
  spreadTranslationsStaticProps,
} from "../../../../common/utils/translations";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps(
  spreadTranslationsStaticProps
);

const Edit = asOneWePage((locale2Messages: Locale2Messages) => {
  const editTranslations = useTranslations("actions.edit");
  const appState = useAppState();
  const router = useRouter();
  const posiId = useCurrentPosiId();
  const posiFormDataConverter = usePosiFormDataConverter();
  const posiDocRef = doc(
    appState.firestore,
    "impacts",
    String(posiId)
  ).withConverter(posiFormDataConverter);
  const [posi] = useDocumentData(posiDocRef);

  const onUpdate = async (usersPosi: PosiFormData) => {
    const cleanedPosi = pickBy(usersPosi, identity);
    const parsedPosi = posiFormData.parse(cleanedPosi);
    await setDoc(posiDocRef, parsedPosi);
    router.push(`/posi/${posiId}`);
  };

  const onDelete = (p: PosiFormData) => {
    const initiativeRoute = `/initiatives/${p.makerId}`;

    router.prefetch(initiativeRoute);

    return async () => {
      await deleteDoc(posiDocRef);
      router.push(initiativeRoute);
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
        <Typography variant="h1">{editTranslations("title")} 🤸 </Typography>
      </Stack>
      {posi ? (
        <PosiForm
          onInteraction={{ type: "update", onUpdate, onDelete: onDelete(posi) }}
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
