import { AppBar, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import {
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
  SyntheticEvent,
} from "react";

interface LinkTabProps {
  label: string;
  href: string;
  icon: string | ReactElement<any, string | JSXElementConstructor<any>>;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Link href={props.href}>
      <Tab component="a" {...props} />
    </Link>
  );
}
/**<LinkTab
          icon={<Typography>🏁</Typography>}
          label="WeRace"
          href={
            footerStateContext
              ? footerStateContext.navigationLinks.weRace
              : "/v1/weRace"
          }
        />
        <LinkTab
          icon={<Typography>🗳️</Typography>}
          label="Mis Votos"
          href="/v1/weRace"
        /> */

export const Footer = (
  props: PropsWithChildren<{
    value: number;
    handleChange: (event: SyntheticEvent, newValue: number) => void;
  }>
) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "pink",
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
