import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ShareActionArea from "../../../../common/components/shareActionArea";
import { Check, ContentCopy, Share } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useCurrentMaker } from "../../../../modules/makers/context";
import {
  buildShareLinks,
  useCopyToClipboard,
} from "../../../../modules/makers/inviteAsMaker";

const SharePage = () => {
  const router = useRouter();
  const { invitedAsMaker, makerName, inviter } = router.query;
  const [maker] = useCurrentMaker();
  const { path, href } = buildShareLinks(
    (invitedAsMaker as string) ?? "",
    (inviter as string) ?? ""
  );
  const [value, copy] = useCopyToClipboard();
  return (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", pt: 2, px: 2 }}
      spacing={3}
    >
      <Typography variant="h2" textAlign="center">
        Tu vinculo está listo
      </Typography>
      <Typography textAlign="center">
        Enviale este vinculo a {makerName} para que ingrese a tu red de OneWe.
      </Typography>
      <Typography textAlign="center">
        Haz clic para copiar el vinculo o presione boton de {'"Compartir."'}
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
      <Button variant="outlined" href={`/makers/${maker?.id}`}>
        Volver a mi perfil
      </Button>
    </Stack>
  );
};

export default SharePage;
