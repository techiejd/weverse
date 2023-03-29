import { Paper, PaperProps, Typography } from "@mui/material";

export const PillBoxMessage = (props: PaperProps) => {
  const { children, sx, ...others } = props;
  return (
    <Paper
      sx={{
        width: "fit-content",
        borderRadius: 10,
        backgroundColor: "primary",
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
        variant="h3"
      >
        {children}
      </Typography>
    </Paper>
  );
};
