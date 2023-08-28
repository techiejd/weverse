import { CircularProgress, Stack, Typography } from "@mui/material";
import ShareActionArea from "../../../../common/components/shareActionArea";
import Hearing from "@mui/icons-material/Hearing";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAppState } from "../../../../common/context/appState";
import { useMakerConverter } from "../../../../common/utils/firebase";
import { useCurrentPosi } from "../../../../modules/posi/context";
import { WithTranslationsStaticProps } from "../../../../common/utils/translations";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../common/components/onewePage";
import { useRouter } from "next/router";
import { Locale } from "../../../../functions/shared/src";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Solicit = asOneWePage(() => {
  const appState = useAppState();
  const makerConverter = useMakerConverter();

  const [posi] = useCurrentPosi();
  const { locale: userLocale } = useRouter();
  const presentationInfo =
    (posi &&
      ((userLocale && posi[userLocale as Locale]) || posi[posi?.locale!]!)) ||
    undefined;
  const t = useTranslations("actions.impact.solicit");
  const PromptMaker = ({ makerId }: { makerId: string }) => {
    const makerDocRef = doc(
      appState.firestore,
      "makers",
      makerId
    ).withConverter(makerConverter);
    const [maker, makerLoading, makerError] = useDocumentData(makerDocRef);
    return maker ? (
      <Typography variant="h1">
        {t("title", { makerName: maker.name })}
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
      <PromptMaker makerId={posi.makerId!} />
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
