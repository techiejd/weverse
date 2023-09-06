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
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Home from "@mui/icons-material/Home";
import Login from "@mui/icons-material/Login";
import PlusOne from "@mui/icons-material/PlusOne";
import { useAppState } from "../context/appState";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import Image from "next/image";
import LinkBehavior from "../utils/linkBehavior";
import { useTranslations } from "next-intl";
import Logout from "@mui/icons-material/Logout";
import { useSignOut } from "react-firebase-hooks/auth";

export const MenuComponent = (props: BoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);
  const t = useTranslations("common.callToAction");
  const appState = useAppState();
  const [signOut] = useSignOut(appState.auth);
  const UserPortal = () => {
    const { user } = useAppState().authState;
    return user ? (
      <MenuItem
        onClick={() => {
          signOut();
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText>Log out</ListItemText>
      </MenuItem>
    ) : (
      <MenuItem
        onClick={() => {
          setAuthDialogOpen(true);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Login />
        </ListItemIcon>
        <ListItemText>{t("login")}</ListItemText>
      </MenuItem>
    );
  };
  return (
    <Box {...props}>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MenuIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
        <MenuItem onClick={closeMenu} href="/" component={LinkBehavior as any}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText>{t("home")}</ListItemText>
        </MenuItem>
        <MenuItem
          href="/posi"
          onClick={closeMenu}
          component={LinkBehavior as any}
        >
          <ListItemIcon>
            <Typography>
              <b>🤸</b>
            </Typography>
          </ListItemIcon>
          <ListItemText>{t("actions.list")}</ListItemText>
        </MenuItem>
        <MenuItem
          href="/posi/upload"
          onClick={closeMenu}
          component={LinkBehavior as any}
        >
          <ListItemIcon>
            <PlusOne />
          </ListItemIcon>
          <ListItemText>{t("actions.add")}</ListItemText>
        </MenuItem>
        <MenuItem
          href="/initiatives"
          onClick={closeMenu}
          component={LinkBehavior as any}
        >
          <ListItemIcon>
            <Typography>
              <b>💪</b>
            </Typography>
          </ListItemIcon>
          <ListItemText>Makers</ListItemText>
        </MenuItem>
        <UserPortal />
      </Menu>
    </Box>
  );
};

const UserPortal = () => {
  const { user, loading: userLoading } = useAppState().authState;
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  return (
    <Box>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      {userLoading ? (
        <CircularProgress />
      ) : user ? (
        <Button size="small" variant="outlined" href={`/members/${user.uid}`}>
          {user.displayName}
        </Button>
      ) : (
        <AuthDialogButton setAuthDialogOpen={setAuthDialogOpen} />
      )}
    </Box>
  );
};

export const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MenuComponent />
        <Link sx={{ all: "unset" }} href="/">
          <Image
            src="/logo.png"
            priority
            alt="OneWe logo"
            width={"125"}
            height={"20"}
          />
        </Link>

        <div style={{ flexGrow: 1 }}></div>
        <UserPortal />
      </Toolbar>
    </AppBar>
  );
};
