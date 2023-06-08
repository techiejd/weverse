import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useAppState } from "../../../../../common/context/appState";
import { useCurrentMaker } from "../../../../../modules/makers/context";

//TODO(techiejd): WET -> DRY
const MakerButton = () => {
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return maker ? (
    <Button href={`/makers/${maker.id}`} variant="contained">
      Ver las otras acciones e impactos del Maker
    </Button>
  ) : (
    <CircularProgress />
  );
};

const Thanks = () => {
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={1}>
      <Typography variant="h1">¡Así mejoramos el mundo!</Typography>
      <Typography>Gracias a tí, recibimos información muy valiosa.</Typography>
      <Typography>Ahora qué ¿te gustaría hacer?</Typography>
      <MakerButton />
      <Button href="/" variant="contained">
        Ir al inicio
      </Button>
    </Stack>
  );
};

export default Thanks;
