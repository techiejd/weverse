import { Box, CircularProgress } from "@mui/material";
import { Header } from "./header";
import { ComponentType, FC } from "react";
import { useMessages } from "next-intl";

export const asOneWePage = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  const OWP = (props: P) => {
    const messages = useMessages();
    return (
      (messages && (
        <Box>
          <Header />
          <Component {...props} />
        </Box>
      )) || <CircularProgress />
    );
  };
  return OWP;
};
