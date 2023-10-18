import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Check from "@mui/icons-material/Check";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Share from "@mui/icons-material/Share";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { asOneWePage } from "../../../../../../common/components/onewePage";
import ShareActionArea from "../../../../../../common/components/shareActionArea";
import { CachePaths } from "../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../common/utils/translations";
import { useCurrentInitiative } from "../../../../../../modules/initiatives/context";
import {
  buildShareLinks,
  useCopyToClipboard,
} from "../../../../../../modules/initiatives/inviteAnInitiative";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const SharePage = asOneWePage(() => {
  const router = useRouter();
  const {
    invitedInitiatives: invitedInitiativesIn,
    initiativeNames: initiativeNamesIn,
    inviter,
  } = router.query;
  const invitedInitiatives = invitedInitiativesIn
    ? (invitedInitiativesIn as string).split(",")
    : null;
  const initiativeNames = initiativeNamesIn
    ? (initiativeNamesIn as string).split(",")
    : null;
  const [initiative] = useCurrentInitiative();
  const shareLinks = invitedInitiatives
    ? (invitedInitiatives as string[]).map((invitedInitiative) =>
        buildShareLinks(
          (invitedInitiative as string) ?? "",
          (inviter as string) ?? ""
        )
      )
    : null;

  const InviteAsInitiativePortal = ({
    initiativeName,
    href,
    path,
  }: {
    initiativeName: string;
    href: string;
    path: string;
  }) => {
    const [value, copy] = useCopyToClipboard();
    return (
      <Fragment>
        <Typography textAlign="center">
          Enviale este vinculo a {initiativeName} para que ingrese a tu red de
          OneWe.
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
        {invitedInitiatives == null || invitedInitiatives.length == 1
          ? "Tu vinculo está listo"
          : "Tus vinculos están listos"}
      </Typography>
      <Typography textAlign="center">
        Haz clic para copiar el vinculo o presione boton de {'"Compartir."'}
      </Typography>

      {shareLinks &&
        initiativeNames &&
        shareLinks.map((shareLink, idx) => (
          <InviteAsInitiativePortal
            key={shareLink.href}
            href={shareLink.href}
            path={shareLink.path}
            initiativeName={(initiativeNames as string[])[idx]}
          />
        ))}

      <Button variant="outlined" href={`${initiative?.path}`}>
        Volver a mi perfil
      </Button>
    </Stack>
  );
});

export default SharePage;
