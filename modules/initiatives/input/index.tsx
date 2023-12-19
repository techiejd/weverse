import {
  Stack,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
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
import {
  Initiative,
  Media,
  OrganizationType,
  organizationType,
} from "../../../functions/shared/src";
import { FileInput } from "../../posi/input";
import DetailedInput from "./detailedInput";

const InitiativeInput = ({
  userName,
  val,
  setVal,
  locale2Messages,
}: {
  userName: string;
  val: Initiative;
  setVal: Dispatch<SetStateAction<Initiative>>;
  locale2Messages: Locale2Messages;
}) => {
  const initiativeChange = (
    e: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const type = value as "individual" | "organization";

    setVal((initiative) => ({
      ...initiative,
      type: type,
      organizationType:
        type == "organization" ? val.organizationType : undefined,
    }));
  };

  const setEmail = (email: string) => {
    setVal((initiative) => ({
      ...initiative,
      email: email,
    }));
  };

  const detailedInputTranslations = useTranslations(
    "initiatives.edit.detailedInput"
  );

  const [pic, setPic] = useState<Media | undefined | "loading">(
    val.pic ? { type: "img", url: val.pic } : undefined
  );
  useEffect(() => {
    if (pic && pic != "loading") {
      setVal((initiative) => ({ ...initiative, pic: pic.url }));
    }
  }, [pic, setVal]);

  const organizationTypeChange = (
    e: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const type = value as OrganizationType;
    setVal((initiative) => ({
      ...initiative,
      organizationType: type,
    }));
  };

  const inputTranslations = useTranslations("input");
  const initiativeTypesTranslations = useTranslations("initiatives.types");
  const chooseInitiativeTypeTranslations = useTranslations(
    "initiatives.edit.chooseInitiativeType"
  );

  return (
    <Stack alignItems={"center"}>
      <Stack sx={sectionStyles}>
        <Typography variant="h2">
          {chooseInitiativeTypeTranslations("essentialInformation")}
        </Typography>
        <FormControl>
          <RadioGroup
            name="chooseInitiativeType"
            row
            onChange={initiativeChange}
            value={val.type}
          >
            <FormControlLabel
              value="individual"
              control={<Radio required />}
              label={chooseInitiativeTypeTranslations("individual")}
            />
            <FormControlLabel
              value="organization"
              control={<Radio required />}
              label={chooseInitiativeTypeTranslations("organization")}
            />
          </RadioGroup>
        </FormControl>
        <Typography variant="h3">
          {detailedInputTranslations("askForInfoMsg", {
            initiativeType: val.type,
          })}
        </Typography>
        <TextField
          required
          fullWidth
          label={`${chooseInitiativeTypeTranslations("namePrompt", {
            initiativeType: val.type,
          })}* (${inputTranslations("numChars", { numChars: 75 })})`}
          margin="normal"
          inputProps={{ maxLength: 75 }}
          value={val.name ? val.name : ""}
          onChange={(e) => {
            setVal((initiative) => ({
              ...initiative,
              name: e.target.value,
            }));
          }}
        />
        {val.type == "organization" && (
          <FormControl>
            <FormLabel>{initiativeTypesTranslations("title")}</FormLabel>
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
                    label={initiativeTypesTranslations("long." + oType)}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
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
            initiativeType: val.type,
          })}
        >
          <Typography>
            {detailedInputTranslations("askForImage", {
              initiativeType: val.type,
            })}
          </Typography>
          <FileInput
            initialMedia={pic != "loading" ? pic : undefined}
            setMedia={setPic}
            maxFileSize={10485760 /** 10MB */}
            accept={"img"}
            metadata={{ initiativePath: val.path || "" }}
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
