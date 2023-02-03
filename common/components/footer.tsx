import { AppBar, Tab, Tabs, Typography } from "@mui/material";
import {
  JSXElementConstructor,
  ReactElement,
  SyntheticEvent,
  useState,
} from "react";

interface LinkTabProps {
  label?: string;
  href?: string;
  icon?: string | ReactElement<any, string | JSXElementConstructor<any>>;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export const Footer = () => {
  const [value, setValue] = useState(0);

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
        <LinkTab icon={<Typography>🏁</Typography>} label="WeRace" />
        <LinkTab icon={<Typography>🗳️</Typography>} label="Mis Votos" />
      </Tabs>
    </AppBar>
  );
};
