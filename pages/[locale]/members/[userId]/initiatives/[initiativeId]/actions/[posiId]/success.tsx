import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Hearing from "@mui/icons-material/Hearing";
import Share from "@mui/icons-material/Share";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../../../../../common/components/onewePage";
import ShareActionArea from "../../../../../../../../common/components/shareActionArea";
import { CachePaths } from "../../../../../../../../common/utils/staticPaths";
import {
  WithTranslationsStaticProps,
  useLocalizedPresentationInfo,
} from "../../../../../../../../common/utils/translations";
import { useCurrentPosi } from "../../../../../../../../modules/posi/context";
import { useCurrentInitiative } from "../../../../../../../../modules/initiatives/context";
import { QRCode } from "react-qrcode-logo";
import buildUrl from "@googlicius/build-url";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const Success = asOneWePage(() => {
  const [posi] = useCurrentPosi();
  const [initiative] = useCurrentInitiative();
  const presentationInfo = useLocalizedPresentationInfo(posi);
  const t = useTranslations("actions.impact.success");
  const path = `${posi?.path}/testimonials/upload`;
  const qrCodeValue = buildUrl(path, { returnAbsoluteUrl: true });
  const theme = useTheme();
  return posi && initiative ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", p: 2 }}
    >
      <Typography variant="h1">{t("title")}</Typography>
      <Typography variant="h2">
        {t("solicit", { initiativeName: initiative.name })}
      </Typography>
      <ShareActionArea
        shareProps={{
          title: t("solicitText", { for: presentationInfo?.summary }),
          path,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<Share />}
          endIcon={<Hearing />}
          onClick={() => {}}
        >
          {t("shareLink")}
        </Button>
      </ShareActionArea>
      <Typography variant="h2">{t("qrCode")}</Typography>
      <QRCode
        value={qrCodeValue}
        fgColor={theme.palette.primary.main}
        logoImage="/favicon-32x32.png"
      />
    </Stack>
  ) : (
    <CircularProgress />
  );
});

export default Success;
