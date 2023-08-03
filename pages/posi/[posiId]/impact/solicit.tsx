import { CircularProgress, Stack, Typography } from "@mui/material";
import ShareActionArea from "../../../../common/components/shareActionArea";
import { Hearing } from "@mui/icons-material";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAppState } from "../../../../common/context/appState";
import {
  makerConverter,
  posiFormDataConverter,
} from "../../../../common/utils/firebase";
import { useCurrentPosiId } from "../../../../modules/posi/context";
import { WithTranslationsStaticProps } from "../../../../common/utils/translations";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Solicit = () => {
  const posiId = useCurrentPosiId();
  const appState = useAppState();

  const posiDocRef = doc(
    appState.firestore,
    "impacts",
    String(posiId)
  ).withConverter(posiFormDataConverter);
  const [posi, posiLoading, posiError] = useDocumentData(posiDocRef);
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
      {posi.howToIdentifyImpactedPeople ? (
        <Typography variant="h2">
          {t("target", {
            howToIdentifyImpactedPeople: posi.howToIdentifyImpactedPeople,
          })}
        </Typography>
      ) : (
        <Typography>{t("noTarget")}</Typography>
      )}
      <ShareActionArea
        shareProps={{
          title: t("solicitText", { for: posi.summary }),
          path: `/posi/${posiId}/impact/upload`,
        }}
      >
        <Hearing sx={{ fontSize: 160 }} />
      </ShareActionArea>
      <Typography>{t("clickOnEarToSolicit")}</Typography>
    </Stack>
  ) : (
    <CircularProgress />
  );
};

export default Solicit;
