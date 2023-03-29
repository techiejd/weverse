import { Box, BoxProps, Typography } from "@mui/material";

export const PillBoxMessage = (props: BoxProps) => {
  const { children, sx, ...others } = props;
  return (
    <Box
      alignItems="center"
      width={"fit-content"}
      sx={{
        width: "fit-content",
        borderRadius: 10,
        backgroundColor: "primary.main",
        ...sx,
        pb: 0.3,
      }}
      {...others}
    >
      <Typography
        sx={{
          fontSize: "14px",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};
