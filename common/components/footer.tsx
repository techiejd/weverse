import { AppBar, Tabs } from "@mui/material";
import { PropsWithChildren, SyntheticEvent } from "react";

export const Footer = (
  props: PropsWithChildren<{
    value: number;
    handleChange?: (event: SyntheticEvent, newValue: number) => void;
  }>
) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        height: "72px",
        top: "auto",
        bottom: 0,
      }}
    >
      <Tabs centered value={props.value} onChange={props.handleChange}>
        {props.children}
      </Tabs>
    </AppBar>
  );
};
