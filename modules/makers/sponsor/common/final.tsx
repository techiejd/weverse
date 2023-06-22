import { Box, Button, Typography } from "@mui/material";
import { Fragment } from "react";

const Final = ({
  sponsorForm,
  finishedButtonBehavior,
}: {
  sponsorForm: Record<string, string>;
  finishedButtonBehavior: { href: string } | { onClick: () => void };
}) => {
  return (
    <Fragment>
      <Box>
        <Typography>¡Gracias por patrocinar a aldjfl!</Typography>
        <Typography>Juntos cambian el mundo.</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ mt: 3, ml: 1 }}
          {...finishedButtonBehavior}
        >
          Listo
        </Button>
      </Box>
    </Fragment>
  );
};

export default Final;
