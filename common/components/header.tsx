import {
  AppBar,
  Box,
  BoxProps,
  Button,
  CircularProgress,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Home, Login, PlusOne } from "@mui/icons-material";
import { AppState, useAppState } from "../context/appState";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import { LinkBehavior } from "./theme";

export const MenuComponent = (props: BoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);
  return (
    <Box {...props}>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MenuIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
        <MenuItem href="/" onClick={closeMenu}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText>Inicio </ListItemText>
        </MenuItem>
        <MenuItem href="/posi" onClick={closeMenu}>
          <ListItemIcon>
            <Typography>📺</Typography>
          </ListItemIcon>
          <ListItemText>
            <b>We</b>Screen
          </ListItemText>
        </MenuItem>
        <MenuItem href="/posi/upload" onClick={closeMenu}>
          <ListItemIcon>
            <PlusOne />
          </ListItemIcon>
          <ListItemText>Agrega tu impacto!</ListItemText>
        </MenuItem>
        <MenuItem
          component="li"
          onClick={() => {
            setAuthDialogOpen(true);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <Login />
          </ListItemIcon>
          <ListItemText>Log In</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const UserPortal = ({ appState }: { appState: AppState }) => {
  const [user, loading, error] = useAuthState(appState.auth);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  return (
    <Box>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      {loading ? (
        <CircularProgress />
      ) : user ? (
        <Button size="small" variant="outlined" href={`/user/${user.uid}`}>
          {user.displayName}
        </Button>
      ) : (
        <AuthDialogButton setAuthDialogOpen={setAuthDialogOpen} />
      )}
    </Box>
  );
};

export const Header = () => {
  const appState = useAppState();
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
        {appState ? <UserPortal appState={appState} /> : <CircularProgress />}
      </Toolbar>
    </AppBar>
  );
};
