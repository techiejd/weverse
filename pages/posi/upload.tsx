import { Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import PosiForm from "../../modules/posi/action/form";
import LogInPrompt from "../../common/components/logInPrompt";
import { usePosiFormDataConverter } from "../../common/utils/firebase";
import { PosiFormData } from "../../functions/shared/src";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../common/components/onewePage";

export const getStaticProps = WithTranslationsStaticProps();

const Upload = asOneWePage(() => {
  const appState = useAppState();
  const router = useRouter();
  const { user } = useAppState().authState;
  const posiFormDataConverter = usePosiFormDataConverter();
  const onSubmit = async (usersPosi: PosiFormData) => {
    const docRef = await addDoc(
      collection(appState.firestore, "impacts").withConverter(
        posiFormDataConverter
      ),
      usersPosi
    );
    router.push(`/posi/${docRef.id}/impact/solicit`);
  };
  const t = useTranslations("actions.upload");

  return (
    <Stack>
      <Stack
        spacing={1}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Typography variant="h1">{t("title")}</Typography>
      </Stack>
      {user ? (
        <PosiForm onInteraction={{ type: "create", onSubmit }} />
      ) : (
        <LogInPrompt title={t("logInPrompt")} />
      )}
    </Stack>
  );
});

export default Upload;
