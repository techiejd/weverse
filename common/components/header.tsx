import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import * as HeaderContext from "../context/header";
import { useAuthUser } from "next-firebase-auth";

export const Header = () => {
  const authUser = useAuthUser();
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
            color: "secondary.main",
          }}
        >
          {authUser.id ? (
            authUser.displayName ? (
              authUser.displayName
            ) : (
              <Link href={"/user/registration/personal"}>Register</Link>
            )
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
