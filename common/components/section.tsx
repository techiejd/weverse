import { Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

const Section = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Typography variant="h2">{label}:</Typography>
      {children}
    </Stack>
  );
};

export default Section;
