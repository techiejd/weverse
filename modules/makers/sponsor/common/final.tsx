import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppState } from "../../../../common/context/appState";
import { Maker } from "../../../../functions/shared/src";

const Final = ({
  exitButtonBehavior,
  loading,
  beneficiary,
}: {
  exitButtonBehavior: { href: string } | { onClick: () => void };
  loading?: boolean;
  beneficiary: Maker;
}) => {
  const appState = useAppState();
  return (
    <Fragment>
      <Box>
        <Typography>
          {appState.authState.user?.displayName}, ¡Gracias por patrocinar a{" "}
          {beneficiary.name}!
        </Typography>
        <Typography>Juntos cambian el mundo.</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <LoadingButton
          variant="contained"
          sx={{ mt: 3, ml: 1 }}
          {...exitButtonBehavior}
          disabled={loading}
          loading={loading}
        >
          Listo
        </LoadingButton>
      </Box>
    </Fragment>
  );
};

export default Final;
