import { CircularProgress, Stack, Typography } from "@mui/material";
import ShareActionArea from "../../../../common/components/shareActionArea";
import Hearing from "@mui/icons-material/Hearing";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAppState } from "../../../../common/context/appState";
import { useInitiativeConverter } from "../../../../common/utils/firebase";
import { useCurrentPosi } from "../../../../modules/posi/context";
import {
  WithTranslationsStaticProps,
  useLocalizedPresentationInfo,
} from "../../../../common/utils/translations";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Solicit = asOneWePage(() => {
  const appState = useAppState();
  const initiativeConverter = useInitiativeConverter();

  const [posi] = useCurrentPosi();
  const presentationInfo = useLocalizedPresentationInfo(posi);
  const t = useTranslations("actions.impact.solicit");
  const PromptInitiative = ({ initiativeId }: { initiativeId: string }) => {
    const initiativeDocRef = doc(
      appState.firestore,
      "makers",
      initiativeId
    ).withConverter(initiativeConverter);
    const [initiative, initiativeLoading, initiativeError] =
      useDocumentData(initiativeDocRef);
    return initiative ? (
      <Typography variant="h1">
        {t("title", { initiativeName: initiative.name })}
      </Typography>
    ) : (
      <CircularProgress />
    );
  };
  return posi ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", p: 2 }}
    >
      <PromptInitiative initiativeId={posi.makerId!} />
      <ShareActionArea
        shareProps={{
          title: t("solicitText", { for: presentationInfo?.summary }),
          path: `/posi/${presentationInfo}/impact/upload`,
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
