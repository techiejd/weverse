import { MuiTelInputInfo, MuiTelInput } from "mui-tel-input";
import { Dispatch, SetStateAction, useState } from "react";
import { AuthAction, AuthDialogState } from "./context";

const PhoneInput = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [phoneNumberIn, setPhoneNumberIn] = useState("");

  const onPhoneNumberChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 10) {
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
  return (
    <MuiTelInput
      defaultCountry="CO"
      continents={["NA", "SA"]}
      value={phoneNumberIn}
      error={authDialogState.phoneNumberInputError}
      onChange={onPhoneNumberChange}
      label="Número telefónico."
      helperText={`Vas a recibir un código de verificación para completar el ${
        authDialogState.authAction == AuthAction.logIn ? "ingreso" : "registro"
      }.`}
    />
  );
};

export default PhoneInput;
