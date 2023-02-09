import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { useAppState, useSetAppState } from "../context/appState";
import * as HeaderContext from "../context/header";

export const Header = () => {
  const headerStateContext = HeaderContext.useHeaderState();
  const appState = useAppState();
  useEffect(() => {
    console.log(appState);
  }, [appState]);
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
          }}
          onClick={() => {
            if (appState && appState?.user == undefined && setAppState) {
              setAppState({ ...appState, requestLogIn: true });
            }
          }}
        >
          {appState?.user ? appState.user.name : "LOGIN"}
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
