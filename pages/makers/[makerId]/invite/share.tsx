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
import { useState } from "react";
import buildUrl from "@googlicius/build-url";

// From https://usehooks-ts.com/react-hook/use-copy-to-clipboard
type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      alert(
        'Copiar al portapapeles no es compatible con tu navegador. Haz clic en "Compartir".'
      );
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      alert('Copiar al portapapeles falló. Haz clic en "Compartir".');
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

const SharePage = () => {
  const router = useRouter();
  const { invitedAsMaker, makerName } = router.query;
  const [maker] = useCurrentMaker();
  const path = buildUrl(`/makers/${invitedAsMaker}`, {
    queryParams: {
      invitedAsMaker: invitedAsMaker,
      registerRequested: true,
    },
  });
  const href = buildUrl(path, { returnAbsoluteUrl: true });
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
