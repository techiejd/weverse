import { Box, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Index = () => {
  return (
    <Box>
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 64,
          right: 16,
        }}
        href="/posi/upload"
      >
        <AddIcon sx={{ mr: 1 }} />
        <Typography>Agrega tu impacto!</Typography>
      </Fab>
    </Box>
  );
};

export default Index;
