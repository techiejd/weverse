import { Button, Stack } from "@mui/material";

const VotingPortal = () => {
  return (
    <Stack m={2} spacing={2}>
      <Button href="/posi" variant="contained">
        Ver todos los impactos sociales.
      </Button>
      <Button href="/makers" variant="contained">
        Ver a todos los Makers.
      </Button>
      <Button href="/posi/upload" variant="contained">
        Sube tu impacto.
      </Button>
    </Stack>
  );
};

export default VotingPortal;
