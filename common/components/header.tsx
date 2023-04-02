import { AppBar, IconButton, Link, Toolbar, Typography } from "@mui/material";
import * as HeaderContext from "../context/header";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";

export const Header = () => {
  const authUser = useAuthUser();
  const router = useRouter();
  // TODO(techiejd): look into removing header context and modularizing the header.
  const headerStateContext = HeaderContext.useHeaderState();
  return (
    <AppBar position="static" sx={{ background: "palette.background.paper" }}>
      <Toolbar>
        <IconButton>
          <MenuIcon />
        </IconButton>
        <div style={{ flexGrow: 1 }}></div>
        <Typography fontSize={"16px"} noWrap>
          🪐<b>We</b>Verse
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Typography
          sx={{
            mr: 1,
          }}
        >
          {authUser.id ? (
            authUser.displayName ? (
              authUser.displayName
            ) : (
              <Link href={"/user/registration/personal"}>Register</Link>
            )
          ) : (
            <Link href={`/auth?destination=${router.pathname}`}>LOGIN</Link>
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
