import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Link,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import AuthDialog, { AuthDialogButton } from "../../../modules/auth/AuthDialog";
import { useAppState } from "../../context/appState";
import LanguagePortal from "./languagePortal";
import { Locale2Messages } from "../../utils/translations";
import MenuComponent from "./menuComponent";

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

export const Header = ({
  locale2Messages,
}: {
  locale2Messages: Locale2Messages;
}) => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MenuComponent />
        <Link sx={{ all: "unset" }} href="/">
          <Image
            src="/logo.png"
            priority
            alt="OneWe logo"
            width={"100"}
            height={"25"}
          />
        </Link>

        <div style={{ flexGrow: 1 }}></div>
        <LanguagePortal locale2Messages={locale2Messages} />
        <UserPortal />
      </Toolbar>
    </AppBar>
  );
};
