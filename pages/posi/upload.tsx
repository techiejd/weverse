import { Box, NativeSelect, Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import PosiForm from "../../modules/posi/action/form";
import LogInPrompt from "../../common/components/logInPrompt";
import { usePosiFormDataConverter } from "../../common/utils/firebase";
import { PosiFormData } from "../../functions/shared/src";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTranslations,
} from "next-intl";
import { asOneWePage } from "../../common/components/onewePage";
import { useEffect, useState } from "react";

type Messages = typeof import("../../messages/en.json");

export const getStaticProps = WithTranslationsStaticProps(async (context) => {
  const [en, es] = await Promise.all([
    import("../../messages/en.json"),
    import("../../messages/es.json"),
  ]);
  return {
    props: {
      en: en.default,
      es: es.default,
    },
  };
});

const Upload = asOneWePage(({ en, es }: { en: Messages; es: Messages }) => {
  const appState = useAppState();
  const router = useRouter();
  const { user } = useAppState().authState;
  const posiFormDataConverter = usePosiFormDataConverter();
  const locale = useLocale();
  const [chosenLocale, setChosenLocale] = useState(locale);
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
      <Box
        width="100%"
        alignItems="center"
        justifyContent="center"
        display="flex"
      >
        <Box textAlign={"center"} width="fit-content">
          <Typography variant="h1">{t("title")}</Typography>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="end"
            spacing={1}
          >
            <Typography>Publishing in the </Typography>
            <NativeSelect
              value={chosenLocale}
              onChange={(e) => {
                setChosenLocale(e.target.value);
              }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </NativeSelect>
            <Typography>channel.</Typography>
          </Stack>
        </Box>
      </Box>

      <NextIntlClientProvider messages={eval(chosenLocale)}>
        {user ? (
          <PosiForm onInteraction={{ type: "create", onSubmit }} />
        ) : (
          <LogInPrompt title={t("logInPrompt")} />
        )}
      </NextIntlClientProvider>
    </Stack>
  );
});

export default Upload;
