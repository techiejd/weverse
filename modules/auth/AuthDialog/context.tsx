import { z } from "zod";
import { ConfirmationResult } from "firebase/auth";
import { phoneNumber } from "../../../functions/shared/src";

const authPhoneNumber = phoneNumber.partial();

export type PhoneNumber = z.infer<typeof authPhoneNumber>;
export const encodePhoneNumber = (pN: PhoneNumber) =>
  `+${pN.countryCallingCode}${pN.nationalNumber}`;

export enum AuthAction {
  logIn = 0,
  register = 1,
}

export type AuthDialogState = {
  phoneNumber: PhoneNumber;
  phoneNumberInputError: boolean;
  name: string;
  authAction: AuthAction;
  recaptchaConfirmationResult?: ConfirmationResult;
  otpDialogOpen: boolean;
  recaptchaDialogOpen: boolean;
  confirmRegistrationDialogOpen: boolean;
  checkingUserRegistered: boolean;
  userRegisteredError: boolean;
};
