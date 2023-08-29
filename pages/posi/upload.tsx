import { Box, Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import PosiForm from "../../modules/posi/action/form";
import LogInPrompt from "../../common/components/logInPrompt";
import { usePosiFormDataConverter } from "../../common/utils/firebase";
import { PosiFormData, locale } from "../../functions/shared/src";
import {
  Locale2Messages,
  WithTranslationsStaticProps,
  spreadTranslationsStaticProps,
} from "../../common/utils/translations";
import { asOneWePage } from "../../common/components/onewePage";
import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";

export const getStaticProps = WithTranslationsStaticProps(
  spreadTranslationsStaticProps
);

const Upload = asOneWePage((locale2Messages: Locale2Messages) => {
  const appState = useAppState();
  const router = useRouter();
  const { user } = useAppState().authState;
  const posiFormDataConverter = usePosiFormDataConverter();
  const localeIn = useLocale();
  const onSubmit = useCallback(
    async (usersPosi: PosiFormData) => {
      console.log({ usersPosi, localeIn });
      const docRef = await addDoc(
        collection(appState.firestore, "impacts").withConverter(
          posiFormDataConverter
        ),
        { ...usersPosi, locale: locale.parse(localeIn) }
      );
      router.push(`/posi/${docRef.id}/impact/solicit`);
    },
    [appState.firestore, localeIn, posiFormDataConverter, router]
  );
  const t = useTranslations("actions.upload");

  return (
    <Stack>
      <Box
        width="100%"
        alignItems="center"
        justifyContent="center"
        display="flex"
      >
        <Box textAlign={"center"} width="fit-content">
          <Typography variant="h1">{t("title")}</Typography>
        </Box>
      </Box>
      {user ? (
        <PosiForm
          onInteraction={{ type: "create", onSubmit }}
          locale2Messages={locale2Messages}
        />
      ) : (
        <LogInPrompt title={t("logInPrompt")} />
      )}
    </Stack>
  );
});

export default Upload;
