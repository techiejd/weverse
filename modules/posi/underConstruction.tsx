import { Stack, Typography, Box } from "@mui/material";

const UnderConstruction = () => {
  return (
    <Stack alignItems={"center"} justifyContent={"center"}>
      <Typography variant="h1">Vuelva pronto!</Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          src="/underConstruction.png"
        />
      </Box>
    </Stack>
  );
};

export default UnderConstruction;
