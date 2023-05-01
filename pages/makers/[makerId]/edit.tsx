import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Maker } from "../../../common/context/weverse";
import MakerInput from "../../../modules/auth/AuthDialog/makerInput";

/**
 *  const makerDocRef = await (async () => {
              const makerEncoded = maker.parse({
                ...authDialogState.maker,
                ownerId: userCred.user.uid,
                name:
                  authDialogState.maker?.type == "individual"
                    ? authDialogState.name
                    : authDialogState.maker?.name,
              });
              return await addDoc(
                collection(appState.firestore, "makers").withConverter(
                  makerConverter
                ),
                makerEncoded
              );
            })();

            const memberDocPromise = setDoc(
              doc(
                appState.firestore,
                "members",
                userCred.user.uid
              ).withConverter(memberConverter),
              { makerId: makerDocRef.id }
            );

            photoURL:
                authDialogState.maker?.type == "individual"
                  ? authDialogState.maker?.pic
                  : undefined,
 */

const Register = () => {
  const [maker, setMaker] = useState<Maker>({
    ownerId: "helloworld",
    type: "individual",
    name: "uName",
  });
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={2}>
      <Typography variant="h1">Editar tu página Maker.</Typography>
      <Typography variant="h2">
        Maker = creador de impacto social a traves de sus Actions.
      </Typography>
      <form>
        <MakerInput userName="uName" val={maker} setVal={setMaker} />
      </form>
    </Stack>
  );
};

export default Register;
