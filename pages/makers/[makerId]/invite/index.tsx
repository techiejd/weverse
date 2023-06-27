// On this page, a user can invite a maker to join the platform.
// The user first pick's the type of maker they will invite.
// Then the user fills out the maker's name.
// Lastly, a button to generate a link is displayed.
// This button links to the next page where the user can share the invite.
// This button also creates a new maker document in the firestore and sets the new maker id as part of current maker's incubatee collection.

import {
  FormControl,
  InputLabel,
  NativeSelect,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCurrentMaker } from "../../../../modules/makers/context";
import { LoadingButton } from "@mui/lab";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { useAppState } from "../../../../common/context/appState";
import {
  incubateeConverter,
  makerConverter,
} from "../../../../common/utils/firebase";
import { v4 } from "uuid";

const Invite = () => {
  const appState = useAppState();
  const [makerType, setMakerType] = useState("nonprofit");
  const [makerName, setMakerName] = useState("");
  const [maker] = useCurrentMaker();
  const [loading, setLoading] = useState(false);
  const invitationToken = v4();
  const makerDocRef = doc(
    appState.firestore,
    "makers",
    invitationToken
  ).withConverter(makerConverter);
  const incubateeDocRef = maker
    ? doc(
        appState.firestore,
        "makers",
        maker.id!,
        "incubatees",
        invitationToken
      ).withConverter(incubateeConverter)
    : null;

  const onSelectMakerType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMakerType(event.target.value);
  };
  return (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", pt: 2, px: 2 }}
      spacing={4}
    >
      <Typography variant="h2" textAlign="center">
        Invita a un maker a tu red de OneWe.
      </Typography>
      <FormControl fullWidth sx={{ maxWidth: 600 }}>
        <InputLabel htmlFor="makerType">Tipo de maker</InputLabel>
        <NativeSelect
          sx={{ width: "100%" }}
          value={makerType}
          onChange={onSelectMakerType}
          inputProps={{
            name: "makerType",
            id: "makerType",
          }}
        >
          <option value="individual">Individuo</option>
          <option value="nonprofit">Fundación u otra ONG</option>
          <option value="religious">Organización Religiosa</option>
          <option value="unincorporated">Voluntarios</option>
          <option value="profit">Organización Comercial</option>
        </NativeSelect>
      </FormControl>
      <TextField
        required
        label={`¿Cómo se llama ${
          makerType == "individual" ? "el individuo" : "la organización?"
        }`}
        margin="normal"
        inputProps={{ maxLength: 75 }}
        fullWidth
        sx={{ maxWidth: 600 }}
        value={makerName}
        onChange={(e) => setMakerName(e.target.value)}
      />
      <LoadingButton
        variant="contained"
        sx={{ width: "fit-content" }}
        disabled={!makerName || loading || !maker}
        href={`/makers/${maker?.id}/invite/share?makerType=${makerType}&makerName=${makerName}&invitationToken=${invitationToken}`}
        loading={loading}
        onClick={() => {
          setLoading(true);
          if (!incubateeDocRef) return false;
          const setMaker = setDoc(makerDocRef, {
            ownerId: "invited",
            type: makerType == "individual" ? "individual" : "organization",
            name: makerName,
            incubator: maker?.id,
          });
          const setIncubatee = setDoc(incubateeDocRef, {
            acceptedInvite: false,
          });
          Promise.all([setMaker, setIncubatee]).then(() => {
            setLoading(false);
          });
        }}
      >
        Generar vinculo
      </LoadingButton>
    </Stack>
  );
};

export default Invite;
