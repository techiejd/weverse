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
import { setDoc, doc } from "firebase/firestore";
import { useAppState } from "../../../../common/context/appState";
import {
  incubateeConverter,
  makerConverter,
} from "../../../../common/utils/firebase";
import { v4 } from "uuid";
import { organizationType } from "../../../../functions/shared/src";

const Invite = () => {
  const appState = useAppState();
  const [makerType, setMakerType] = useState("nonprofit");
  const [makerName, setMakerName] = useState("");
  const [maker] = useCurrentMaker();
  const [loading, setLoading] = useState(false);
  const invitedAsMaker = v4();
  const makerDocRef = doc(
    appState.firestore,
    "makers",
    invitedAsMaker
  ).withConverter(makerConverter);
  const incubateeDocRef = maker
    ? doc(
        appState.firestore,
        "makers",
        maker.id!,
        "incubatees",
        invitedAsMaker
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
        href={
          maker
            ? `/makers/${maker.id!}/invite/share?makerType=${makerType}&makerName=${makerName}&invitedAsMaker=${invitedAsMaker}&registerRequested=true`
            : undefined
        }
        loading={loading}
        onClick={() => {
          setLoading(true);
          if (!incubateeDocRef) return false;
          const setMaker = setDoc(makerDocRef, {
            ownerId: "invited",
            type: makerType == "individual" ? "individual" : "organization",
            organizationType:
              makerType == "individual"
                ? undefined
                : organizationType.parse(makerType),
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
