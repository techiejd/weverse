import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

const PageTitle = ({ title }: { title: ReactNode }) => {
  return (
    <Box p={1}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" justifyContent={"center"}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>by OneWe</Typography>
      </Box>
    </Box>
  );
};
export default PageTitle;
