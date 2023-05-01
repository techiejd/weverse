import {
  Box,
  FormControl,
  FormControlLabel,
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
import { FileInput } from "../../posi/input";
import {
  Maker,
  OrganizationType,
  organizationLabels,
  organizationType,
} from "../../../common/context/weverse";
import HowToSupportInput from "../../posi/input/HowToSupportInput";
import { Section } from "../../../pages/posi/upload";

const OrganizationTypeInput = ({
  val,
  setVal,
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
}) => {
  const organizationTypeChange = (
    e: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const type = value as OrganizationType;
    setVal((maker) => ({
      ...maker,
      organizationType: type,
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
        value={val.name ? val.name : ""}
        onChange={(e) => {
          setVal((maker) => ({
            ...maker,
            name: e.target.value,
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
  val,
  setVal,
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
}) => {
  const [imgUrl, setImgUrl] = useState<string | undefined | "loading">(
    undefined
  );
  useEffect(() => {
    setVal((maker) => ({ ...maker, pic: imgUrl }));
  }, [imgUrl, setVal]);

  const askForInfoMsg =
    val.type == "individual"
      ? "Elige tu foto de perfil"
      : "Cuéntanos un poco sobre tu organización";

  const askForImage =
    val.type == "individual"
      ? "Selecciona una imagen con la que quieras ser identificado por la comunidad OneWe."
      : "Sube una foto de tu logo.";

  return (
    <Stack margin={2} spacing={2}>
      <Typography variant="h3">{askForInfoMsg}</Typography>
      {val.type == "organization" && (
        <OrganizationTypeInput val={val} setVal={setVal} />
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

const MakerInput = ({
  userName,
  val,
  setVal,
}: {
  userName: string;
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
}) => {
  const makerChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    const type = value as "individual" | "organization";

    setVal((maker) => ({
      ...maker,
      type: type,
      organizationType:
        type == "organization" ? val.organizationType : undefined,
      name: type == "organization" ? val.name : userName,
    }));
  };
  console.log(val.type);

  return (
    <Stack>
      <FormControl>
        <RadioGroup
          name="chooseMakerType"
          row
          onChange={makerChange}
          value={val.type}
        >
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
      <DetailedInput val={val} setVal={setVal} />
    </Stack>
  );
};

export default MakerInput;
