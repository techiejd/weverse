import { Box } from "@mui/material";
import { Header } from "./header";
import { ComponentType, FC } from "react";

export const asOneWePage = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  const OWP = (props: P) => {
    return (
      <Box>
        <Header />
        <Component {...props} />
      </Box>
    );
  };
  return OWP;
};
