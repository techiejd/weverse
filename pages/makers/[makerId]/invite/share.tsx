import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ShareActionArea from "../../../../common/components/shareActionArea";
import Check from "@mui/icons-material/Check";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Share from "@mui/icons-material/Share";
import { useRouter } from "next/router";
import { useCurrentMaker } from "../../../../modules/makers/context";
import {
  buildShareLinks,
  useCopyToClipboard,
} from "../../../../modules/makers/inviteAsMaker";
import { Fragment } from "react";
import { WithTranslationsStaticProps } from "../../../../common/utils/translations";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const SharePage = asOneWePage(() => {
  const router = useRouter();
  const {
    invitedAsMakers: invitedAsMakersIn,
    makerNames: makerNamesIn,
    inviter,
  } = router.query;
  const invitedAsMakers = invitedAsMakersIn
    ? (invitedAsMakersIn as string).split(",")
    : null;
  const makerNames = makerNamesIn ? (makerNamesIn as string).split(",") : null;
  const [maker] = useCurrentMaker();
  const shareLinks = invitedAsMakers
    ? (invitedAsMakers as string[]).map((invitedAsMaker) =>
        buildShareLinks(
          (invitedAsMaker as string) ?? "",
          (inviter as string) ?? ""
        )
      )
    : null;

  const InviteAsMakerPortal = ({
    makerName,
    href,
    path,
  }: {
    makerName: string;
    href: string;
    path: string;
  }) => {
    const [value, copy] = useCopyToClipboard();
    return (
      <Fragment>
        <Typography textAlign="center">
          Enviale este vinculo a {makerName} para que ingrese a tu red de OneWe.
        </Typography>
        <TextField
          value={href}
          label="Vinculo"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  {value && value.includes(href) ? <Check /> : <ContentCopy />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onClick={() => copy(href)}
        />

        <ShareActionArea
          shareProps={{
            path: path,
            text: "Unate a mi red de incubadora en OneWe.",
            title: "Unate a mi red de incubadora en OneWe.",
          }}
        >
          <Button variant="contained" startIcon={<Share />}>
            Compartir
          </Button>
        </ShareActionArea>
      </Fragment>
    );
  };

  return (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", pt: 2, px: 2 }}
      spacing={3}
    >
      <Typography variant="h2" textAlign="center">
        {invitedAsMakers == null || invitedAsMakers.length == 1
          ? "Tu vinculo está listo"
          : "Tus vinculos están listos"}
      </Typography>
      <Typography textAlign="center">
        Haz clic para copiar el vinculo o presione boton de {'"Compartir."'}
      </Typography>

      {shareLinks &&
        makerNames &&
        shareLinks.map((shareLink, idx) => (
          <InviteAsMakerPortal
            key={shareLink.href}
            href={shareLink.href}
            path={shareLink.path}
            makerName={(makerNames as string[])[idx]}
          />
        ))}

      <Button variant="outlined" href={`/makers/${maker?.id}`}>
        Volver a mi perfil
      </Button>
    </Stack>
  );
});

export default SharePage;
