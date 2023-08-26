import { Box, NativeSelect, Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import PosiForm from "../../modules/posi/action/form";
import LogInPrompt from "../../common/components/logInPrompt";
import { usePosiFormDataConverter } from "../../common/utils/firebase";
import { Locale, PosiFormData, locale } from "../../functions/shared/src";
import {
  Locale2Messages,
  WithTranslationsStaticProps,
  localeDisplayNames,
  spreadTranslationsStaticProps,
} from "../../common/utils/translations";
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import { asOneWePage } from "../../common/components/onewePage";
import { useCallback, useState } from "react";

export const getStaticProps = WithTranslationsStaticProps(
  spreadTranslationsStaticProps
);

const Upload = asOneWePage((locale2Messages: Locale2Messages) => {
  const appState = useAppState();
  const router = useRouter();
  const { user } = useAppState().authState;
  const posiFormDataConverter = usePosiFormDataConverter();
  const localeIn = useLocale();
  const [chosenLocale, setChosenLocale] = useState<Locale>(localeIn as Locale);
  const onSubmit = useCallback(
    async (usersPosi: PosiFormData) => {
      const docRef = await addDoc(
        collection(appState.firestore, "impacts").withConverter(
          posiFormDataConverter
        ),
        { ...usersPosi, locale: locale.parse(chosenLocale) }
      );
      router.push(`/posi/${docRef.id}/impact/solicit`);
    },
    [appState.firestore, chosenLocale, posiFormDataConverter, router]
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
                setChosenLocale(e.target.value as Locale);
              }}
            >
              {Object.keys(locale.Enum).map((l) => (
                <option value={l} key={l}>
                  {localeDisplayNames[locale.parse(l)]}
                </option>
              ))}
            </NativeSelect>
            <Typography>channel.</Typography>
          </Stack>
        </Box>
      </Box>

      <NextIntlClientProvider messages={locale2Messages[chosenLocale]}>
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
