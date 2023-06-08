import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useCurrentPosi } from "../../../../../modules/posi/context";
import { useAppState } from "../../../../../common/context/appState";

const ImpactsButton = () => {
  const [action, actionLoading, actionError] = useCurrentPosi();
  return action ? (
    <Button href={`/posi/${action.id}`} variant="contained">
      Ver lo que han dicho los demas de esta acción
    </Button>
  ) : (
    <CircularProgress />
  );
};

const MakerButton = () => {
  const [action, actionLoading, actionError] = useCurrentPosi();
  return action ? (
    <Button href={`/makers/${action.makerId}`} variant="contained">
      Ver las otras acciones e impactos del Maker
    </Button>
  ) : (
    <CircularProgress />
  );
};

const Thanks = () => {
  const appState = useAppState();
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={1}>
      <Typography variant="h1">¡Así mejoramos el mundo!</Typography>
      <Typography>Gracias a tí, recibimos información muy valiosa.</Typography>
      <Typography>Ahora qué ¿te gustaría hacer?</Typography>
      <ImpactsButton />
      <MakerButton />
      <Button href="/" variant="contained">
        Ir al inicio
      </Button>
    </Stack>
  );
};

export default Thanks;
