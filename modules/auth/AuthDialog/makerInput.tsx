import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AuthDialogState } from "./context";
import { FileInput } from "../../posi/input";

const OrganizationTypeInput = ({
  setAuthDialogState,
}: {
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    setAuthDialogState((aDS) => ({
      ...aDS,
      maker: {
        ...aDS.maker,
        name: nameInput,
      },
    }));
  }, [nameInput, setAuthDialogState]);
  return (
    <Box>
      <TextField
        required
        fullWidth
        label={`¿Cómo se llama la organización? (75 caracteres)`}
        margin="normal"
        inputProps={{ maxLength: 75 }}
        value={nameInput}
        onChange={(e) => {
          setNameInput(e.target.value);
        }}
      />
      <FormControl>
        <FormLabel>Tipo de la organización.</FormLabel>
        <RadioGroup name="chooseOrganizationType">
          <FormControlLabel
            value="non-profit"
            control={<Radio required />}
            label="Fundación u Otra ONG"
          />
          <FormControlLabel
            value="religious"
            control={<Radio required />}
            label="Organización Religiosa"
          />
          <FormControlLabel
            value="governmental"
            control={<Radio required />}
            label="Organización Gubermental"
          />
          <FormControlLabel
            value="volunteers"
            control={<Radio required />}
            label="Voluntarios u Otro No Asociados"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

const DetailedInput = ({
  type,
  setAuthDialogState,
}: {
  type: "individual" | "organization";
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [imgUrl, setImgUrl] = useState<string | undefined | "loading">(
    undefined
  );
  useEffect(() => {
    setAuthDialogState((aDS) => ({
      ...aDS,
      maker: {
        ...aDS.maker,
        pic: imgUrl,
      },
    }));
  }, [imgUrl, setAuthDialogState]);

  const askForInfoMsg =
    type == "individual"
      ? "Cuéntame sobre ti"
      : "Cuéntame sobre la organización";

  const askForImage =
    type == "individual"
      ? "Una foto de perfil por favor."
      : "Tu logo por favor.";

  return (
    <Stack margin={2}>
      <Typography variant="h3">{askForInfoMsg}</Typography>
      {type == "organization" && (
        <OrganizationTypeInput setAuthDialogState={setAuthDialogState} />
      )}
      <Typography>{askForImage}</Typography>
      <FileInput
        required
        setFileUrl={setImgUrl}
        maxFileSize={1048576 /** 1MB */}
        accept={"img"}
        metadata={{ makerId: "" }}
      />
    </Stack>
  );
};

const ChooseMakerType = ({
  setAuthDialogState,
}: {
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [makerType, setMakerType] = useState<
    "individual" | "organization" | undefined
  >();
  const makerChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    const type = value as "individual" | "organization";
    setMakerType(type);
    setAuthDialogState((aDS) => ({
      ...aDS,
      maker: {
        ...aDS.maker,
        type: type,
      },
    }));
  };

  return (
    <Stack>
      <FormControl>
        <FormLabel>Maker</FormLabel>
        <RadioGroup name="chooseMakerType" row onChange={makerChange}>
          <FormControlLabel
            value="individual"
            control={<Radio required />}
            label="Individual"
          />
          <FormControlLabel
            value="organization"
            control={<Radio required />}
            label="Organization"
          />
        </RadioGroup>
      </FormControl>
      {makerType && (
        <DetailedInput
          type={makerType}
          setAuthDialogState={setAuthDialogState}
        />
      )}
    </Stack>
  );
};

const MakerInput = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  return (
    <Box pb={2}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={authDialogState.maker != undefined}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAuthDialogState((aDS) => {
                  console.log("AYO iN here: ", aDS, e.target.checked);
                  return {
                    ...aDS,
                    maker: aDS.maker ? aDS.maker : {},
                  };
                })
              }
              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />
          }
          label={
            <Box>
              <Typography fontSize={20}>Soy un Maker.</Typography>
            </Box>
          }
        />
        <FormHelperText>
          Maker = Creador de impacto social positivo. Debes ser mayor de edad.
        </FormHelperText>
      </FormGroup>
      {authDialogState.maker && (
        <ChooseMakerType setAuthDialogState={setAuthDialogState} />
      )}
    </Box>
  );
};

export default MakerInput;
