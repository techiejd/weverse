import { Box, Typography } from "@mui/material";

export const PillBoxMessage = (props: { children: string }) => {
  return (
    <Box alignItems="center">
      <Typography
        sx={{
          border: 1,
          borderRadius: 10,
          fontSize: "14px",
          marginTop: 1,
          marginBottom: 1,
          marginLeft: 2,
          marginRight: 2,
        }}
        align="center"
      >
        {props.children}
      </Typography>
    </Box>
  );
};
