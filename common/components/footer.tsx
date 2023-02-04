import { AppBar, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import {
  JSXElementConstructor,
  ReactElement,
  SyntheticEvent,
  useState,
} from "react";
import * as FooterContext from "../context/footer";

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

export const Footer = () => {
  const [value, setValue] = useState(0);
  const footerStateContext = FooterContext.useFooterState();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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
      <Tabs centered value={value} onChange={handleChange}>
        <LinkTab
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
        />
      </Tabs>
    </AppBar>
  );
};
