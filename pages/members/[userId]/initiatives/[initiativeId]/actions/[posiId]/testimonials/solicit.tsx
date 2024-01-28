import { CircularProgress, Stack, Typography } from "@mui/material";
import Hearing from "@mui/icons-material/Hearing";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../../../../../common/components/onewePage";
import ShareActionArea from "../../../../../../../../common/components/shareActionArea";
import { useAppState } from "../../../../../../../../common/context/appState";
import { useInitiativeConverter } from "../../../../../../../../common/utils/firebase";
import { CachePaths } from "../../../../../../../../common/utils/staticPaths";
import {
  WithTranslationsStaticProps,
  useLocalizedPresentationInfo,
} from "../../../../../../../../common/utils/translations";
import { useCurrentPosi } from "../../../../../../../../modules/posi/context";
import { useCurrentInitiative } from "../../../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const PromptInitiative = ({ initiativePath }: { initiativePath: string }) => {
  const appState = useAppState();
  const initiativeConverter = useInitiativeConverter();
  const t = useTranslations("actions.impact.solicit");

  const initiativeDocRef = doc(
    appState.firestore,
    initiativePath
  ).withConverter(initiativeConverter);
  const [initiative] = useDocumentData(initiativeDocRef);
  return initiative ? (
    <Typography variant="h1">
      {t("title", { initiativeName: initiative.name })}
    </Typography>
  ) : (
    <CircularProgress />
  );
};

const Solicit = asOneWePage(() => {
  const [posi] = useCurrentPosi();
  const [initiative] = useCurrentInitiative();
  const presentationInfo = useLocalizedPresentationInfo(posi);
  const t = useTranslations("actions.impact.solicit");
  return posi ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", p: 2 }}
    >
      <PromptInitiative initiativePath={initiative?.path!} />
      <ShareActionArea
        shareProps={{
          title: t("solicitText", { for: presentationInfo?.summary }),
          path: `${posi.path}/testimonials/upload`,
        }}
      >
        <Hearing sx={{ fontSize: 160 }} />
      </ShareActionArea>
      <Typography>{t("clickOnEarToSolicit")}</Typography>
    </Stack>
  ) : (
    <CircularProgress />
  );
});

export default Solicit;
