import {
  MuiTelInputInfo,
  MuiTelInput,
  MuiTelInputCountry,
} from "mui-tel-input";
import { Dispatch, SetStateAction, useState } from "react";
import { AuthDialogState } from "./context";
import { useTranslations } from "next-intl";
import { useAppState } from "../../../common/context/appState";

const PhoneInput = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [phoneNumberIn, setPhoneNumberIn] = useState("");
  const appState = useAppState();

  const onPhoneNumberChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 12) {
      // https://www.quora.com/What-is-maximum-and-minimum-length-of-any-mobile-number-across-the-world
      setAuthDialogState((aDS) => ({
        ...aDS,
        phoneNumber: {
          countryCallingCode: info.countryCallingCode
            ? info.countryCallingCode
            : undefined,
          nationalNumber: info.nationalNumber ? info.nationalNumber : undefined,
        },
      }));
      setPhoneNumberIn(value);
    }
  };
  const inputTranslations = useTranslations("input");
  const authTranslations = useTranslations("auth");
  return (
    <MuiTelInput
      defaultCountry={
        inputTranslations("defaultCountry.short") as MuiTelInputCountry
      }
      langOfCountryName={appState.languages.primary}
      value={phoneNumberIn}
      error={authDialogState.phoneNumberInputError}
      onChange={onPhoneNumberChange}
      label={inputTranslations("phoneNumber")}
      helperText={authTranslations("validationProcess", {
        action: authDialogState.authAction,
      })}
    />
  );
};

export default PhoneInput;
