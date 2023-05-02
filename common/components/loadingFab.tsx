import { Pending } from "@mui/icons-material";
import { Fab, Typography } from "@mui/material";

const LoadingFab = () => {
  return (
    <Fab
      variant="extended"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
      color="primary"
    >
      <Pending sx={{ mr: 1 }} />
      <Typography>Loading</Typography>
    </Fab>
  );
};

export default LoadingFab;
