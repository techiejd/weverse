import {
  AppBar,
  Box,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import * as HeaderContext from "../context/header";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Home, Login, PlusOne } from "@mui/icons-material";

export const MenuComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  return (
    <Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={(e) => setAnchorEl(null)}
      >
        <MenuItem href="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText>Inicio </ListItemText>
        </MenuItem>
        <MenuItem href="/posi">
          <ListItemIcon>
            <Typography>📺</Typography>
          </ListItemIcon>
          <ListItemText>
            <b>We</b>Screen
          </ListItemText>
        </MenuItem>
        <MenuItem href="/posi/upload">
          <ListItemIcon>
            <PlusOne />
          </ListItemIcon>
          <ListItemText>Agrega tu impacto!</ListItemText>
        </MenuItem>
        <MenuItem href="/auth">
          <ListItemIcon>
            <Login />
          </ListItemIcon>
          <ListItemText>Log In</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export const Header = () => {
  const authUser = useAuthUser();
  const router = useRouter();
  // TODO(techiejd): look into removing header context and modularizing the header.
  const headerStateContext = HeaderContext.useHeaderState();
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <MenuComponent />
        <div style={{ flexGrow: 1 }}></div>
        <Typography fontSize={"16px"} noWrap>
          <Link sx={{ all: "unset" }} href="/">
            🪐<b>We</b>Verse
          </Link>
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
