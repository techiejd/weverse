import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import {
  Maker,
  makerConverter,
  maker as makerSchema,
} from "../../../common/context/weverse";
import MakerInput from "../../../modules/auth/AuthDialog/makerInput";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { AppState, useAppState } from "../../../common/context/appState";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { pickBy, identity } from "lodash";

const MakerForm = ({
  makerId,
  appState,
}: {
  makerId: string;
  appState: AppState;
}) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const makerDocRef = doc(appState.firestore, "makers", makerId);
  const [maker, makerLoading, makerError] = useDocumentData(
    makerDocRef.withConverter(makerConverter)
  );

  const MakerFormContent = ({
    user,
    makerIn,
  }: {
    user: User;
    makerIn: Maker;
  }) => {
    const [maker, setMaker] = useState<Maker>(makerIn);
    const [uploading, setUploading] = useState(false);
    return (
      <form
        onSubmit={async (e) => {
          setUploading(true);
          e.preventDefault();
          const cleanedMaker = pickBy(maker, identity);
          makerSchema.parse(cleanedMaker);
          console.log(cleanedMaker);
          await updateDoc(makerDocRef, cleanedMaker);
          setUploading(false);
        }}
      >
        <MakerInput
          userName={user.displayName ? user.displayName : ""}
          val={maker}
          setVal={setMaker}
        />
        <Stack
          sx={{
            width: "100%",
            alignItems: "center",
            justifyItems: "center",
            pb: 2,
          }}
        >
          {uploading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained">
              Actualizar
            </Button>
          )}
        </Stack>
      </form>
    );
  };

  if (user && maker) {
    // Using if instead of tertiary to avoid ts issues.
    return <MakerFormContent user={user} makerIn={maker} />;
  } else return <CircularProgress />;
};

const Edit = () => {
  const appState = useAppState();
  const router = useRouter();
  const { makerId } = router.query;
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={2}>
      <Typography variant="h1">Editar tu página Maker.</Typography>
      <Typography variant="h2">
        Maker = creador de impacto social a través de sus acciones.
      </Typography>
      {appState && makerId ? (
        <MakerForm makerId={String(makerId)} appState={appState} />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};

export default Edit;
