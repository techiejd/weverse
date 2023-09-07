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
  Maker,
  OrganizationType,
  organizationType,
} from "../../../functions/shared/src";

const OrganizationTypeInput = ({
  val,
  setVal,
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
}) => {
  const organizationTypeTranslations = useTranslations(
    "initiatives.edit.chooseInitiativeType.organizationType"
  );
  const makerTypesTranslations = useTranslations("initiatives.types");
  const inputTranslations = useTranslations("input");
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
        label={`${organizationTypeTranslations(
          "namePrompt"
        )} (${inputTranslations("numChars", { numChars: 75 })})`}
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
        <FormLabel>{makerTypesTranslations("title")}</FormLabel>
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
                label={makerTypesTranslations("long." + oType)}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default OrganizationTypeInput;
