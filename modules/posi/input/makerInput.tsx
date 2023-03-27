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
import FileInput from "./fileInput";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useFormData } from "./context";

const OrganizationTypeInput = () => {
  return (
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
  );
};

const DetailedInput = ({ type }: { type: "individual" | "organization" }) => {
  const [imgUrl, setImgUrl] = useState<string | undefined | "loading">(
    undefined
  );
  const [nameInput, setNameInput] = useState("");
  const [formData, setFormData] = useFormData();
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        maker: {
          ...fD.maker,
          pic: imgUrl,
        },
      }));
    }
  }, [imgUrl, setFormData]);

  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        maker: {
          ...fD.maker,
          name: nameInput,
        },
      }));
    }
  }, [nameInput, setFormData]);

  const askForInfoMsg =
    type == "individual"
      ? "Cuéntame sobre ti"
      : "Cuéntame sobre la organización";
  const nameLabel =
    type == "individual"
      ? "¿Cómo te llamas?"
      : "¿Cómo se llama la organización? (75 caracteres)";
  const askForImage =
    type == "individual"
      ? "Una foto de perfil por favor."
      : "Tu logo por favor.";

  return (
    <Stack margin={2}>
      <Typography variant="h3">{askForInfoMsg}</Typography>
      {type == "organization" && <OrganizationTypeInput />}
      <TextField
        required
        fullWidth
        label={`${nameLabel} (75 caracteres)`}
        name="maker-name"
        margin="normal"
        inputProps={{ maxLength: 75 }}
        value={nameInput}
        onChange={(e) => {
          setNameInput(e.target.value);
        }}
      />
      <Typography>{askForImage}</Typography>
      <FileInput
        required
        setFileUrl={setImgUrl}
        maxFileSize={1048576 /** 1MB */}
        accept={"img"}
      />
    </Stack>
  );
};

const MakerInput = () => {
  const [makerType, setMakerType] = useState<
    "individual" | "organization" | undefined
  >();
  const [formData, setFormData] = useFormData();
  const makerChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    const type = value as "individual" | "organization";
    setMakerType(type);
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        maker: {
          ...fD.maker,
          type: type,
        },
      }));
    }
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
      {makerType && <DetailedInput type={makerType} />}
    </Stack>
  );
};

export default MakerInput;
