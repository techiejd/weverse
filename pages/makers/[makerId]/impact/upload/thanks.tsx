import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { AppState, useAppState } from "../../../../../common/context/appState";
import { useCurrentMaker } from "../../../../../modules/makers/context";

//TODO(techiejd): WET -> DRY
const MakerButton = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return maker ? (
    <Button href={`/makers/${maker.id}`} variant="contained">
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
      {appState && <MakerButton appState={appState} />}
      <Button href="/" variant="contained">
        Ir al inicio
      </Button>
    </Stack>
  );
};

export default Thanks;
