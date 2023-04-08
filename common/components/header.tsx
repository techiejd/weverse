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
import AuthDialog from "../../modules/auth/AuthDialog";

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
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            setAuthDialogOpen(true);
          }}
        >
          LOGIN
        </Button>
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
