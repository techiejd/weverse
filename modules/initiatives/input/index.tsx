import {
  Stack,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useState,
  useEffect,
} from "react";
import AddInternationalizedDetailedInput from "../../../common/components/addInternationalizedDetailedInput";
import Section from "../../../common/components/section";
import { sectionStyles } from "../../../common/components/theme";
import { Locale2Messages } from "../../../common/utils/translations";
import { Maker, Media } from "../../../functions/shared/src";
import { FileInput } from "../../posi/input";
import DetailedInput from "./detailedInput";
import OrganizationTypeInput from "./organizationTypeInput";

const InitiativeInput = ({
  userName,
  val,
  setVal,
  locale2Messages,
}: {
  userName: string;
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
  locale2Messages: Locale2Messages;
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
  const chooseMakerTypeTranslations = useTranslations(
    "makers.edit.chooseMakerType"
  );

  const setEmail = (email: string) => {
    setVal((maker) => ({
      ...maker,
      email: email,
    }));
  };

  const detailedInputTranslations = useTranslations(
    "makers.edit.detailedInput"
  );

  const askForInfoMsg = detailedInputTranslations("askForInfoMsg", {
    makerType: val.type,
  });

  const [pic, setPic] = useState<Media | undefined | "loading">(
    val.pic ? { type: "img", url: val.pic } : undefined
  );
  useEffect(() => {
    if (pic && pic != "loading") {
      setVal((maker) => ({ ...maker, pic: pic.url }));
    }
  }, [pic, setVal]);
  const askForImage = detailedInputTranslations("askForImage", {
    makerType: val.type,
  });

  const inputTranslations = useTranslations("input");
  return (
    <Stack alignItems={"center"}>
      <Stack sx={sectionStyles}>
        <Typography variant="h2">
          {chooseMakerTypeTranslations("entityInformation")}
        </Typography>
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
              label={chooseMakerTypeTranslations("individual")}
            />
            <FormControlLabel
              value="organization"
              control={<Radio required />}
              label={chooseMakerTypeTranslations("organization")}
            />
          </RadioGroup>
        </FormControl>
        <Typography variant="h3">{askForInfoMsg}</Typography>
        {val.type == "organization" && (
          <OrganizationTypeInput val={val} setVal={setVal} />
        )}
        <Section label={detailedInputTranslations("email")}>
          <TextField
            label={inputTranslations("email")}
            type="email"
            fullWidth
            value={val.email ? val.email : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Section>
        <Section
          label={detailedInputTranslations("profileImage", {
            makerType: val.type,
          })}
        >
          <Typography>{askForImage}</Typography>
          <FileInput
            initialMedia={pic != "loading" ? pic : undefined}
            setMedia={setPic}
            maxFileSize={10485760 /** 10MB */}
            accept={"img"}
            metadata={{ makerId: "", userID: "" }}
          />
        </Section>
      </Stack>
      <DetailedInput val={val} setVal={setVal} locale={val.locale!} />
      <AddInternationalizedDetailedInput
        val={val}
        setVal={setVal}
        locale2Messages={locale2Messages}
        detailedInput={DetailedInput}
      />
    </Stack>
  );
};

export default InitiativeInput;
