import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import { useAppState, useSetAppState } from "../context/appState";
import * as HeaderContext from "../context/header";

export const Header = () => {
  const headerStateContext = HeaderContext.useHeaderState();
  const appState = useAppState();
  const setAppState = useSetAppState();
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
            color: "secondary.main",
          }}
        >
          {appState?.user ? (
            appState.user.name
          ) : (
            <Link href={"/auth"}>LOGIN</Link>
          )}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            border: 1,
            borderRadius: 1,
            padding: 1,
            borderColor: "secondary.main",
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
