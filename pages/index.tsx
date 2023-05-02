import { Box, Button, Stack } from "@mui/material";
import PageTitle from "../common/components/pageTitle";
import AuthDialog from "../modules/auth/AuthDialog";
import { useEffect, useState } from "react";
import { AuthAction } from "../modules/auth/AuthDialog/context";
import { AppState, useAppState } from "../common/context/appState";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc } from "firebase/firestore";
import { memberConverter } from "../common/context/weverse";
import { User } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Image from "next/image";

const MakerPortal = ({ appState }: { appState: AppState }) => {
  const [user, loading, error] = useAuthState(appState.auth);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  useEffect(() => {
    if (user && !loading && !error) {
    }
  }, [user, loading, error, appState.firestore]);
  const MakerPortalBtn = ({ user }: { user: User }) => {
    const memberDocRef = doc(
      appState.firestore,
      "members",
      user.uid
    ).withConverter(memberConverter);
    const [member, loading, error] = useDocumentData(memberDocRef);

    return (
      <Button
        href={`/makers/${member?.makerId}`}
        variant="contained"
        disabled={!member}
        fullWidth
      >
        📛 Mi Página Maker
      </Button>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AuthDialog
        open={authDialogOpen}
        setOpen={setAuthDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      {user ? (
        <MakerPortalBtn user={user} />
      ) : (
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            setAuthDialogOpen(true);
          }}
        >
          +🧑 Registrarte como Maker.
        </Button>
      )}
    </Box>
  );
};

const WeVerse = () => {
  const appState = useAppState();
  return (
    <Box>
      <Stack m={2} spacing={2}>
        <PageTitle
          title={
            <>
              <Image src="/Icon.png" alt="OneWe logo" width={40} height={40} />{" "}
              <b>One</b>We
            </>
          }
        />
        <Button href="/posi" variant="contained">
          🤸‍♀️ Acción
        </Button>
        <Button href="/makers" variant="contained">
          💪 Makers
        </Button>
        <Button href="/posi/upload" variant="contained">
          🤸‍♀️ Agrega tu Acción
        </Button>
        {appState ? (
          <MakerPortal appState={appState} />
        ) : (
          <Button variant="contained" disabled>
            Loading...
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default WeVerse;
