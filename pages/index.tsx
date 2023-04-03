import { Button, Stack } from "@mui/material";

const VotingPortal = () => {
  return (
    <Stack m={2} spacing={2}>
      <Button href="/posi" variant="contained">
        Ver todos los impactos
      </Button>
      <Button href="/posi/upload" variant="contained">
        Sube tu impacto
      </Button>
    </Stack>
  );
};

export default VotingPortal;
