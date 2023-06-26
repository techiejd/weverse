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
import Section from "../../../common/components/section";
import {
  Maker,
  OrganizationType,
  organizationType,
  Media,
} from "../../../functions/shared/src";

const organizationExplanations = {
  [organizationType.Enum.nonprofit]: "Fundación u otra ONG",
  [organizationType.Enum.religious]: "Organización Religiosa",
  [organizationType.Enum.unincorporated]: "Voluntarios",
  [organizationType.Enum.profit]: "Organización Comercial",
};

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
          value={val.organizationType ?? null}
        >
          {Object.keys(organizationType.Values).map((val) => {
            const oType = val as OrganizationType;
            return (
              <FormControlLabel
                key={oType}
                value={oType}
                control={<Radio required />}
                label={organizationExplanations[oType]}
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
  const [media, setMedia] = useState<Media | undefined | "loading">(
    val.pic ? { type: "img", url: val.pic } : undefined
  );
  useEffect(() => {
    if (media && media != "loading") {
      setVal((maker) => ({ ...maker, pic: media.url }));
    }
  }, [media, setVal]);

  const setAboutInput = (about: string) => {
    setVal((maker) => ({ ...maker, about: about }));
  };

  const setContactSupport = (contactSupport: string) => {
    setVal((maker) => ({
      ...maker,
      howToSupport: { ...maker.howToSupport, contact: contactSupport },
    }));
  };
  const setEmail = (email: string) => {
    setVal((maker) => ({
      ...maker,
      email: email,
    }));
  };

  const askForInfoMsg =
    val.type == "individual" ? "" : "Cuéntanos un poco sobre tu organización";

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
      <Section
        label={
          "OneWe se comunicará contigo por correo electrónico acerca de la información relacionada con Maker"
        }
      >
        <TextField
          label="Correo Electronico"
          type="email"
          fullWidth
          value={val.email ? val.email : ""}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Section>

      <Section
        label={
          val.type == "organization"
            ? "Elige la foto de perfil de la organización"
            : "Elige tu foto de perfil"
        }
      >
        <Typography>{askForImage}</Typography>
        <FileInput
          initialMedia={val.pic ? { type: "img", url: val.pic } : undefined}
          setMedia={setMedia}
          maxFileSize={10485760 /** 10MB */}
          accept={"img"}
          metadata={{ makerId: "", userID: "" }}
        />
      </Section>
      <Section
        label={
          val.type == "organization"
            ? "Cuéntanos acerca de la organización y sus iniciativas"
            : "Cuéntanos acerca de tí y tus iniciativas"
        }
      >
        <TextField
          fullWidth
          label="Danos una historia (1000 caracteres)"
          name="summary"
          multiline
          minRows={3}
          inputProps={{ maxLength: 1000 }}
          helperText="Es aquí donde puedes dar detalles"
          value={val.about ? val.about : ""}
          onChange={(e) => setAboutInput(e.target.value)}
        />
      </Section>
      <Section
        label={`¿Qué tipo de apoyo necesita${
          val.type == "organization" ? "" : "s"
        }?`}
      >
        <TextField
          fullWidth
          label="Deja aquí los datos de contacto para recibir ayudas de cualquier otro
          tipo y sea explicito a lo que está pidiendo. (500 caracteres.)"
          name="summary"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText="Si tu iniciativa está listo para recibir voluntarios, hablar con medios de comunicación o con especialistas como abogados, desarrolladores, etc, por favor, indica tu solicitud y los enlaces o los detalles para ponerse en contacto contigo. Por ejemplo: número telefónico, correo electrónico, redes sociales, página web, etc."
          value={val.howToSupport?.contact ? val.howToSupport.contact : ""}
          onChange={(e) => {
            setContactSupport(e.target.value);
          }}
        />
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

  return (
    <Stack alignItems={"center"}>
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
