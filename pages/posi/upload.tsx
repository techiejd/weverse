import { Stack, Typography } from "@mui/material";
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
  // TODO: useTranslations doesn't work with dynamic imports
  // How to get messages from a dynamic import?
  // Maybe I can look into getStaticProps and getServerSideProps.
  const messagesIn = useMessages();
  const locale = useLocale();
  console.log(locale);
  const [messages, setMessages] = useState<AbstractIntlMessages | undefined>(
    messagesIn
  );
  useEffect(() => {
    (async () => {
      setMessages(await import(`../../messages/es.json`));
    })();
  }, [setMessages]);

  console.log(messages);

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
      <NextIntlClientProvider locale="es" messages={messages}>
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
