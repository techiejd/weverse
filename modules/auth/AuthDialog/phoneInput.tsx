import {
  MuiTelInputInfo,
  MuiTelInput,
  MuiTelInputCountry,
} from "mui-tel-input";
import { Dispatch, SetStateAction, useState } from "react";
import { AuthAction, AuthDialogState } from "./context";
import { useTranslations } from "next-intl";

const PhoneInput = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [phoneNumberIn, setPhoneNumberIn] = useState("");

  const onPhoneNumberChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 12) {
      // https://www.quora.com/What-is-maximum-and-minimum-length-of-any-mobile-number-across-the-world
      setAuthDialogState((aDS) => ({
        ...aDS,
        phoneNumber: {
          countryCallingCode: info.countryCallingCode,
          nationalNumber: info.nationalNumber,
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
