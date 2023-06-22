import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Autocomplete, Box, TextField } from "@mui/material";
import { MuiTelInput, MuiTelInputInfo } from "mui-tel-input";
import { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { Step } from "./utils";

const PhoneInput = ({
  sponsorForm,
  setPhoneNumberError,
  phoneNumberError,
}: {
  sponsorForm: Record<string, string>;
  setPhoneNumberError: React.Dispatch<React.SetStateAction<boolean>>;
  phoneNumberError: boolean;
}) => {
  const [phoneNumberIn, setPhoneNumberIn] = useState(
    sponsorForm.phoneNumber ?? ""
  );
  const onPhoneNumberChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 10) {
      setPhoneNumberIn(value);
      setPhoneNumberError(
        !info.countryCallingCode ||
          !info.nationalNumber == null ||
          info.nationalNumber?.length != 10
      );
    }
  };
  return (
    <Box>
      <MuiTelInput
        variant="standard"
        defaultCountry="CO"
        name="phoneNumber"
        value={phoneNumberIn}
        onChange={onPhoneNumberChange}
        label="Número telefónico"
        required
        error={phoneNumberError}
        fullWidth
      />
    </Box>
  );
};

const CustomerDetails = ({
  sponsorForm,
  handleBack,
}: {
  sponsorForm: Record<string, string>;
  handleBack: () => void;
}) => {
  const [phoneNumberError, setPhoneNumberError] = React.useState(false);
  const [forwardDisabled, setForwardDisabled] = React.useState(false);

  React.useEffect(() => {
    setForwardDisabled(phoneNumberError);
  }, [phoneNumberError, setForwardDisabled]);

  const [countryInfo, setCountryInfo] = useState(
    sponsorForm.country && sponsorForm.countryCode
      ? {
          country: sponsorForm.country,
          code: sponsorForm.countryCode,
        }
      : { country: "Colombia", code: "CO" }
  );

  const prevStepLoading =
    sponsorForm[Step.toString(Step.chooseSponsorship)] == "loading";

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Detalles de pago
      </Typography>
      <input hidden value={"customerDetails"} name="stepString" readOnly />
      <input hidden readOnly value={countryInfo.code} name="countryCode" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue={sponsorForm.firstName ?? ""}
            label="Nombres"
            name="firstName"
            variant="standard"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue={sponsorForm.lastName ?? ""}
            label="Apellidos"
            name="lastName"
            variant="standard"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue={sponsorForm.email ?? ""}
            label="Correo"
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
            setPhoneNumberError={setPhoneNumberError}
            phoneNumberError={phoneNumberError}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue={sponsorForm.postalCode ?? ""}
            label="Código postal"
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
                label="Pais"
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
        <React.Fragment>
          <LoadingButton
            onClick={handleBack}
            sx={{ mt: 3, ml: 1 }}
            loading={prevStepLoading}
            disabled={prevStepLoading}
          >
            <span>Atras</span>
          </LoadingButton>
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ mt: 3, ml: 1 }}
            loading={prevStepLoading}
            disabled={prevStepLoading || forwardDisabled}
          >
            <span>Siguiente</span>
          </LoadingButton>
        </React.Fragment>
      </Box>
    </React.Fragment>
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
