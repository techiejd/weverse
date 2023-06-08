import { Box, Button, ButtonProps, Stack, Typography } from "@mui/material";
import PageTitle from "../common/components/pageTitle";
import AuthDialog from "../modules/auth/AuthDialog";
import { useEffect, useState } from "react";
import { AuthAction } from "../modules/auth/AuthDialog/context";
import { useAppState } from "../common/context/appState";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Image from "next/image";
import { memberConverter } from "../common/utils/firebase";

const FrontPageButton = (props: ButtonProps) => {
  return (
    <Button
      variant="contained"
      sx={{ width: "100%", maxWidth: 350 }}
      {...props}
    />
  );
};

const MakerPortal = () => {
  const appState = useAppState();
  const { user } = useAppState().authState;
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const MakerPortalBtn = ({ user }: { user: User }) => {
    const memberDocRef = doc(
      appState.firestore,
      "members",
      user.uid
    ).withConverter(memberConverter);
    const [member, loading, error] = useDocumentData(memberDocRef);

    return (
      <FrontPageButton href={`/makers/${member?.makerId}`} disabled={!member}>
        📛 Mi Página Maker
      </FrontPageButton>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AuthDialog
        open={authDialogOpen}
        setOpen={setAuthDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      <Stack
        sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
      >
        {user ? (
          <MakerPortalBtn user={user} />
        ) : (
          <FrontPageButton
            onClick={() => {
              setAuthDialogOpen(true);
            }}
          >
            🧑 ¡Regístrate como maker!
          </FrontPageButton>
        )}
      </Stack>
    </Box>
  );
};

const WeVerse = () => {
  const appState = useAppState();
  return (
    <Box>
      <Stack
        p={2}
        spacing={2}
        sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
      >
        <PageTitle
          title={
            <>
              <Image
                src="/logo.png"
                alt="OneWe logo"
                priority
                width={250}
                height={40}
              />
            </>
          }
        />
        <Typography>
          Validando e incentivando el mundo de impacto social.
        </Typography>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>
            Estas son las acciones que están cambiando el mundo:
          </Typography>
          <FrontPageButton href="/posi">🤸‍♀️ Acciones</FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          Ellos son nuestros héroes sin capa:
          <FrontPageButton href="/makers">💪 Makers</FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>¿Quieres compartir tu acción? ¡Hazlo aquí!:</Typography>
          <FrontPageButton href="/posi/upload">
            🤸‍♀️ Agrega tu Acción
          </FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>Tú:</Typography>
          <MakerPortal />
        </Stack>
      </Stack>
    </Box>
  );
};

export default WeVerse;
