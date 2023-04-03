import {
  AppBar,
  Box,
  BoxProps,
  Button,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Home, Login, PlusOne } from "@mui/icons-material";

export const MenuComponent = (props: BoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  return (
    <Box {...props}>
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
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <MenuComponent />
        <Typography fontSize={"16px"} noWrap>
          <Link sx={{ all: "unset" }} href="/">
            🪐<b>We</b>Verse
          </Link>
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        {authUser.id ? (
          authUser.displayName ? (
            authUser.displayName
          ) : (
            <Button
              href={"/user/registration/personal"}
              variant="outlined"
              color="info"
              size="small"
            >
              Register
            </Button>
          )
        ) : (
          <Button href={`/auth?destination=${router.pathname}`} size="small">
            LOGIN
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
