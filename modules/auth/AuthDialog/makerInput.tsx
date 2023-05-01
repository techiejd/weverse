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
import {
  OrganizationType,
  organizationLabels,
  organizationType,
} from "../../../common/context/weverse";
import HowToSupportInput from "../../posi/input/HowToSupportInput";
import { Section } from "../../../pages/posi/upload";

const OrganizationTypeInput = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const organizationTypeChange = (
    e: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const type = value as OrganizationType;
    setAuthDialogState((aDS) => ({
      ...aDS,
      maker: {
        ...aDS.maker,
        organizationType: type,
      },
    }));
  };

  return (
    <Box>
      <TextField
        required
        fullWidth
        label={`¿Cómo se llama la organización? (75 caracteres)`}
        margin="normal"
        inputProps={{ maxLength: 75 }}
        value={authDialogState.maker?.name ? authDialogState.maker?.name : ""}
        onChange={(e) => {
          setAuthDialogState((aDS) => ({
            ...aDS,
            maker: {
              ...aDS.maker,
              name: e.target.value,
            },
          }));
        }}
      />
      <FormControl>
        <FormLabel>Tipo de organización:</FormLabel>
        <RadioGroup
          name="chooseOrganizationType"
          onChange={organizationTypeChange}
        >
          {Object.keys(organizationType.Values).map((val) => {
            const oType = val as OrganizationType;
            return (
              <FormControlLabel
                key={oType}
                value={oType}
                control={<Radio required />}
                label={organizationLabels[oType]}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

const DetailedInput = ({
  type,
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
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
      ? "Elige tu foto de perfil"
      : "Cuéntanos un poco sobre tu organización";

  const askForImage =
    type == "individual"
      ? "Selecciona una imagen con la que quieras ser identificado por la comunidad OneWe."
      : "Sube una foto de tu logo.";

  return (
    <Stack margin={2} spacing={2}>
      <Typography variant="h3">{askForInfoMsg}</Typography>
      {type == "organization" && (
        <OrganizationTypeInput
          authDialogState={authDialogState}
          setAuthDialogState={setAuthDialogState}
        />
      )}
      <Typography>{askForImage}</Typography>
      <FileInput
        required
        setFileUrl={setImgUrl}
        maxFileSize={10485760 /** 10MB */}
        accept={"img"}
        metadata={{ makerId: "", userID: "" }}
      />
      <Section label="¿Qué tipo de apoyo necesitas?">
        <HowToSupportInput />
      </Section>
    </Stack>
  );
};

const ChooseMakerType = ({
  setAuthDialogState,
  authDialogState,
}: {
  authDialogState: AuthDialogState;
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
        <RadioGroup name="chooseMakerType" row onChange={makerChange}>
          <FormControlLabel
            value="individual"
            control={<Radio required />}
            label="Trabajo solo"
          />
          <FormControlLabel
            value="organization"
            control={<Radio required />}
            label="Pertenezco a una organización"
          />
        </RadioGroup>
      </FormControl>
      {makerType && (
        <DetailedInput
          type={makerType}
          authDialogState={authDialogState}
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
              checked={true}
              onClick={(e) =>
                confirm(
                  "A este momemento, solo se permite la entrada a Makers."
                )
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
          {
            "Maker = creador de impacto social. Sólo puedes ingresar si eres uno, y debes ser mayor de edad para registrarte."
          }
        </FormHelperText>
      </FormGroup>
      {authDialogState.maker && (
        <ChooseMakerType
          authDialogState={authDialogState}
          setAuthDialogState={setAuthDialogState}
        />
      )}
    </Box>
  );
};

export default MakerInput;
