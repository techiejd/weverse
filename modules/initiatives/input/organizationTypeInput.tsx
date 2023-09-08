import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, ChangeEvent } from "react";
import {
  Initiative,
  OrganizationType,
  organizationType,
} from "../../../functions/shared/src";

const OrganizationTypeInput = ({
  val,
  setVal,
}: {
  val: Initiative;
  setVal: Dispatch<SetStateAction<Initiative>>;
}) => {
  const organizationTypeTranslations = useTranslations(
    "initiatives.edit.chooseInitiativeType.organizationType"
  );
  const initiativeTypesTranslations = useTranslations("initiatives.types");
  const inputTranslations = useTranslations("input");
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

  return (
    <Box>
      <TextField
        required
        fullWidth
        label={`${organizationTypeTranslations(
          "namePrompt"
        )} (${inputTranslations("numChars", { numChars: 75 })})`}
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
    </Box>
  );
};

export default OrganizationTypeInput;
