import { Box, Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import LogInPrompt from "../../../../../../common/components/logInPrompt";
import { asOneWePage } from "../../../../../../common/components/onewePage";
import { useAppState } from "../../../../../../common/context/appState";
import { usePosiFormDataConverter } from "../../../../../../common/utils/firebase";
import {
  WithTranslationsStaticProps,
  Locale2Messages,
} from "../../../../../../common/utils/translations";
import {
  PosiFormData,
  locale,
  zeroRatings,
} from "../../../../../../functions/shared/src";
import PosiForm from "../../../../../../modules/posi/action/form";
import { CachePaths } from "../../../../../../common/utils/staticPaths";
import { useCurrentInitiative } from "../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Upload = asOneWePage((locale2Messages: Locale2Messages) => {
  const appState = useAppState();
  const router = useRouter();
  const [initiative] = useCurrentInitiative();
  const posiFormDataConverter = usePosiFormDataConverter();
  const localeIn = appState.languages.primary;
  const onSubmit = useCallback(
    async (usersPosi: PosiFormData) => {
      if (!initiative) return;
      const docRef = await addDoc(
        collection(
          appState.firestore,
          `${initiative.path!}/actions`
        ).withConverter(posiFormDataConverter),
        usersPosi
      );
      router.push(`/${docRef.path}/impact/solicit`);
    },
    [appState.firestore, initiative, posiFormDataConverter, router]
  );
  const t = useTranslations("actions.upload");

  return (
    <Stack>
      <Stack
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box textAlign={"center"} width="fit-content">
          <Typography variant="h1">{t("title")}</Typography>
        </Box>
        <Box width={"100%"} maxWidth={"600px"}>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/DkWCwOT9r24?si=MTCz03QyD02od0zx"
              title="What is an action? YT Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </Box>
      </Stack>
      {initiative ? (
        <PosiForm
          onInteraction={{ type: "create", onSubmit }}
          locale2Messages={locale2Messages}
          initialPosi={{ locale: locale.parse(localeIn), ratings: zeroRatings }}
        />
      ) : (
        <LogInPrompt title={t("logInPrompt")} />
      )}
    </Stack>
  );
});

export default Upload;
