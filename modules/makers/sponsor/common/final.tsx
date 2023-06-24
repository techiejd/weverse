import { LoadingButton } from "@mui/lab";
import { Box, Button, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppState } from "../../../../common/context/appState";
import { useCurrentMaker } from "../../context";

const Final = ({
  sponsorForm,
  exitButtonBehavior,
  loading,
}: {
  sponsorForm: Record<string, string>;
  exitButtonBehavior: { href: string } | { onClick: () => void };
  loading?: boolean;
}) => {
  const appState = useAppState();
  const [maker, makerLoading, makerError] = useCurrentMaker();
  return (
    <Fragment>
      <Box>
        <Typography>
          {appState.authState.user?.displayName}, ¡Gracias por patrocinar a
          {maker?.name}!
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
