import {
  Hearing,
  CardGiftcard,
  ConnectWithoutContact,
  Support,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  Typography,
  DialogActions,
} from "@mui/material";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import ShareActionArea from "./shareActionArea";
import { HowToSupport } from "../../functions/shared/src";

const SolicitDialog = ({
  open,
  setOpen,
  howToSupport,
  pathUnderSupport,
  solicitOpinionPath,
  editMakerPath,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  howToSupport: HowToSupport;
  pathUnderSupport: string;
  solicitOpinionPath: string;
  editMakerPath: string;
}) => {
  const queryKeyExt = `?openSupport=`;
  return (
    <Dialog open={open}>
      <DialogTitle>Solicita Apoyo:</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <ShareActionArea
            shareProps={{
              path: pathUnderSupport + queryKeyExt + "generic",
              text: "Me encantaría recibir tu colaboración para mi impacto social.",
              title:
                "Me encantaría recibir tu colaboración para mi impacto social.",
            }}
          >
            <Button variant="outlined" startIcon={<Support />}>
              Solicitar todos
            </Button>
          </ShareActionArea>
          <ShareActionArea
            shareProps={{
              path: solicitOpinionPath,
              text: "Por favor dame tu testimonio sobre mi impacto social",
              title: "Por favor dame tu testimonio sobre mi impacto social",
            }}
          >
            <Button variant="outlined" startIcon={<Hearing />}>
              Solicitar testimonio
            </Button>
          </ShareActionArea>
          <ShareActionArea
            shareProps={{
              path: pathUnderSupport + queryKeyExt + "sponsor",
              text: "Busco patrocinio para mi impacto social",
              title: "Busco patrocinio para mi impacto social",
            }}
          >
            <Button variant="outlined" startIcon={<CardGiftcard />}>
              Solicitar Patrocinio
            </Button>
          </ShareActionArea>
          {howToSupport.contact && (
            <ShareActionArea
              shareProps={{
                path: pathUnderSupport + queryKeyExt + "connect",
                text: "Por favor conectemos sobre mi impacto social",
                title: "Por favor conectemos sobre mi impacto social",
              }}
            >
              <Button variant="outlined" startIcon={<ConnectWithoutContact />}>
                Solicitar Conectar
              </Button>
            </ShareActionArea>
          )}
        </Stack>
        <Typography>
          Recuerda que puedes solicitar y de otro tipo (no financiero)
          <Link href={editMakerPath}> agregándolo en tu perfil de creador</Link>
          .
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SolicitDialog;
