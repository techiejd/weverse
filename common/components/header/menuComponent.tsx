import {
  BoxProps,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import Home from "@mui/icons-material/Home";
import Login from "@mui/icons-material/Login";
import PlusOne from "@mui/icons-material/PlusOne";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import AuthDialog from "../../../modules/auth/AuthDialog";
import { useAppState } from "../../context/appState";
import PublishDialog from "../publishDialog";
import { useSignOut } from "react-firebase-hooks/auth";
import mixpanel from "mixpanel-browser";

const trackSubmit = () => {
  mixpanel.track("Menu", {
    action: "Submit",
  });
};

const UserPortal = ({
  closeMenu,
  openAuthDialog,
}: {
  closeMenu: () => void;
  openAuthDialog: () => void;
}) => {
  const appState = useAppState();
  const { user } = appState.authState;
  const [signOut] = useSignOut(appState.auth);
  const t = useTranslations("common.callToAction");
  return user ? (
    <MenuItem
      onClick={() => {
        trackSubmit();
        mixpanel.track("Authentication", {
          action: "Sign out",
        });
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
        trackSubmit();
        openAuthDialog();
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

export const MenuComponent = (props: BoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => {
    mixpanel.track("Menu", {
      action: "Close",
    });
    setAnchorEl(null);
  };
  const t = useTranslations("common.callToAction");
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  return (
    <Box {...props}>
      <PublishDialog
        open={publishDialogOpen}
        close={() => setPublishDialogOpen(false)}
      />
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      <IconButton
        onClick={(e) => {
          mixpanel.track("Menu", {
            action: "View",
          });
          setAnchorEl(e.currentTarget);
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        MenuListProps={{ id: "MenuList" }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <MenuItem>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText>{t("home")}</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            trackSubmit();
            closeMenu();
            setPublishDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <PlusOne />
          </ListItemIcon>
          <ListItemText>{t("publish")}</ListItemText>
        </MenuItem>
        <Link
          href="/initiatives"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem>
            <ListItemIcon>
              <Typography>
                <b>💪</b>
              </Typography>
            </ListItemIcon>
            <ListItemText>{t("listInitiatives")}</ListItemText>
          </MenuItem>
        </Link>
        <UserPortal
          closeMenu={closeMenu}
          openAuthDialog={() => setAuthDialogOpen(true)}
        />
      </Menu>
    </Box>
  );
};

export default MenuComponent;
