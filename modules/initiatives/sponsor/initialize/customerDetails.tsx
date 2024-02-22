import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Autocomplete, Box, TextField } from "@mui/material";
import {
  MuiTelInput,
  MuiTelInputCountry,
  MuiTelInputInfo,
} from "mui-tel-input";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LoadingButton from "@mui/lab/LoadingButton";
import { Step } from "./utils";
import { useMyMember } from "../../../../common/context/weverseUtils";
import LogInPrompt from "../../../../common/components/logInPrompt";

const PhoneInput = ({
  sponsorForm,
  setPhoneError,
  phoneError: phoneError,
}: {
  sponsorForm: Record<string, string>;
  setPhoneError: Dispatch<SetStateAction<boolean>>;
  phoneError: boolean;
}) => {
  //TODO(techiejd): WET -> DRY
  const [phoneIn, setPhoneIn] = useState(sponsorForm.phone ?? "");
  const onPhoneChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 12) {
      // https://www.quora.com/What-is-maximum-and-minimum-length-of-any-mobile-number-across-the-world
      setPhoneIn(value);
      setPhoneError(
        !info.countryCallingCode ||
          !info.nationalNumber ||
          info.nationalNumber?.length < 4
      );
    }
  };
  const t = useTranslations("input");
  const [myMember] = useMyMember();
  useEffect(() => {
    if (myMember && phoneIn === "") {
      setPhoneIn(
        `+${myMember.phoneNumber.countryCallingCode} ${myMember.phoneNumber.nationalNumber}`
      );
    }
  }, [myMember, phoneIn]);
  return (
    <Box>
      <MuiTelInput
        variant="standard"
        defaultCountry={t("defaultCountry.short") as MuiTelInputCountry}
        name="phone"
        value={phoneIn}
        onChange={onPhoneChange}
        label={t("phoneNumber")}
        required
        error={phoneError}
        fullWidth
      />
    </Box>
  );
};

const CustomerDetails = ({
  sponsorForm,
  handleBack,
  exitButtonBehavior,
}: {
  sponsorForm: Record<string, string>;
  handleBack: () => void;
  exitButtonBehavior: { href: string } | { onClick: () => void };
}) => {
  const customerTranslations = useTranslations("common.sponsor.steps.customer");
  const inputTranslations = useTranslations("input");
  const [phoneError, setPhoneError] = useState(false);
  const [forwardDisabled, setForwardDisabled] = useState(false);
  const [firstName, setFirstName] = useState(sponsorForm.firstName ?? "");
  const [lastName, setLastName] = useState(sponsorForm.lastName ?? "");
  const [myMember] = useMyMember();

  useEffect(() => {
    setForwardDisabled(phoneError);
  }, [phoneError, setForwardDisabled]);

  const [countryInfo, setCountryInfo] = useState(
    sponsorForm.country && sponsorForm.countryCode
      ? {
          country: sponsorForm.country,
          code: sponsorForm.countryCode,
        }
      : {
          country: inputTranslations("defaultCountry.long"),
          code: inputTranslations("defaultCountry.short"),
        }
  );

  const prevStepLoading =
    sponsorForm[Step.toString(Step.chooseSponsorship)] == "loading";

  useEffect(() => {
    if (myMember && firstName === "" && lastName === "") {
      const parsedName = parseName(myMember.name);
      setFirstName(parsedName.firstName);
      setLastName(parsedName.lastName);
    }
  }, [myMember, firstName, lastName]);

  return myMember ? (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        {customerTranslations("title")}
      </Typography>
      <input hidden value={"customerDetails"} name="stepString" readOnly />
      <input hidden readOnly value={countryInfo.code} name="countryCode" />
      <input hidden value={myMember?.path || ""} name="member" readOnly />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            label={inputTranslations("firstName")}
            name="firstName"
            variant="standard"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            label={inputTranslations("lastName")}
            name="lastName"
            variant="standard"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue={sponsorForm.email ?? ""}
            label={inputTranslations("email")}
            type="email"
            name="email"
            variant="standard"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PhoneInput
            sponsorForm={sponsorForm}
            setPhoneError={setPhoneError}
            phoneError={phoneError}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue={sponsorForm.postalCode ?? ""}
            label={inputTranslations("postalCode")}
            name="postalCode"
            variant="standard"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.country}
            renderInput={(params) => (
              <TextField
                label={inputTranslations("country")}
                variant="outlined"
                name="country"
                required
                {...params}
                fullWidth
              />
            )}
            value={countryInfo}
            onChange={(event, value) =>
              setCountryInfo(value ?? { country: "", code: "" })
            }
            isOptionEqualToValue={(option, value) => option.code === value.code}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Fragment>
          <LoadingButton
            onClick={handleBack}
            sx={{ mt: 3, ml: 1 }}
            loading={prevStepLoading}
            disabled={prevStepLoading}
          >
            <span>{inputTranslations("back")}</span>
          </LoadingButton>
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ mt: 3, ml: 1 }}
            loading={prevStepLoading}
            disabled={prevStepLoading || forwardDisabled}
          >
            <span>{inputTranslations("next")}</span>
          </LoadingButton>
        </Fragment>
      </Box>
    </Fragment>
  ) : (
    <LogInPrompt
      title={customerTranslations("logInPrompt")}
      exitButtonBehavior={exitButtonBehavior}
    />
  );
};

export default CustomerDetails;

const countries = [
  { country: "Argentina", code: "AR" },
  { country: "Australia", code: "AU" },
  { country: "Austria", code: "AT" },
  { country: "Belgium", code: "BE" },
  { country: "Bolivia", code: "BO" },
  { country: "Brazil", code: "BR" },
  { country: "Bulgaria", code: "BG" },
  { country: "Canada", code: "CA" },
  { country: "Chile", code: "CL" },
  { country: "Colombia", code: "CO" },
  { country: "Costa Rica", code: "CR" },
  { country: "Croatia", code: "HR" },
  { country: "Cyprus", code: "CY" },
  { country: "Czech Republic", code: "CZ" },
  { country: "Denmark", code: "DK" },
  { country: "Dominican Republic", code: "DO" },
  { country: "Estonia", code: "EE" },
  { country: "Finland", code: "FI" },
  { country: "France", code: "FR" },
  { country: "Germany", code: "DE" },
  { country: "Greece", code: "GR" },
  { country: "Hong Kong SAR China", code: "HK" },
  { country: "Hungary", code: "HU" },
  { country: "Iceland", code: "IS" },
  { country: "India", code: "IN" },
  { country: "Indonesia", code: "ID" },
  { country: "Ireland", code: "IE" },
  { country: "Israel", code: "IL" },
  { country: "Italy", code: "IT" },
  { country: "Japan", code: "JP" },
  { country: "Latvia", code: "LV" },
  { country: "Liechtenstein", code: "LI" },
  { country: "Lithuania", code: "LT" },
  { country: "Luxembourg", code: "LU" },
  { country: "Malta", code: "MT" },
  { country: "Mexico ", code: "MX" },
  { country: "Netherlands", code: "NL" },
  { country: "New Zealand", code: "NZ" },
  { country: "Norway", code: "NO" },
  { country: "Paraguay", code: "PY" },
  { country: "Peru", code: "PE" },
  { country: "Poland", code: "PL" },
  { country: "Portugal", code: "PT" },
  { country: "Romania", code: "RO" },
  { country: "Singapore", code: "SG" },
  { country: "Slovakia", code: "SK" },
  { country: "Slovenia", code: "SI" },
  { country: "Spain", code: "ES" },
  { country: "Sweden", code: "SE" },
  { country: "Switzerland", code: "CH" },
  { country: "Thailand", code: "TH" },
  { country: "Trinidad & Tobago", code: "TT" },
  { country: "United Arab Emirates", code: "AE" },
  { country: "United Kingdom", code: "GB" },
  { country: "United States", code: "US" },
  { country: "Uruguay", code: "UY" },
];

function parseName(fullName: string) {
  // This is simply a best effort to split the name into first and last name.
  // It's not perfect, but it's better than nothing.
  var result = { firstName: "", lastName: "" };
  const names = fullName.split(" ");
  switch (names.length) {
    case 1:
      result.firstName = names[0];
      break;
    case 2:
      result.firstName = names[0];
      result.lastName = names[1];
      break;
    case 3:
      result.firstName = `${names[0]} ${names[1]}`;
      result.lastName = names[2];
      break;
    default:
      result.firstName = `${names[0]} ${names[1]}`;
      result.lastName = names.slice(2).join(" ");
      break;
  }

  return result;
}
