import { AppBar, Toolbar, Typography } from "@mui/material";
import * as HeaderContext from "../context/header";

export const Header = () => {
  const headerStateContext = HeaderContext.useHeaderState();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography fontSize={"16px"} noWrap>
          🪐 <b>We</b>Verse
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Typography
          sx={{
            mr: 1,
          }}
        >
          LOGIN
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            border: 1,
            borderRadius: 1,
            padding: 1,
          }}
        >
          {headerStateContext
            ? `${headerStateContext.exchangeInfo.allowancePrepend} ${headerStateContext.exchangeInfo.allowance}`
            : "=("}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
