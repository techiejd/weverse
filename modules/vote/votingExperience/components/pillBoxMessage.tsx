import { Box, Typography } from "@mui/material";

export const PillBoxMessage = (props: { children: string }) => {
  return (
    <Box alignItems="center">
      <Typography
        sx={{
          borderRadius: 10,
          fontSize: "14px",
          marginTop: 1,
          marginBottom: 1,
          marginLeft: 2,
          marginRight: 2,
          backgroundColor: "background.paper",
        }}
        align="center"
      >
        {props.children}
      </Typography>
    </Box>
  );
};
