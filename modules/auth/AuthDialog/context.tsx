import { z } from "zod";
import { ConfirmationResult } from "firebase/auth";
import { PartialMaker } from "../../../common/context/weverse";

const phoneNumber = z.object({
  countryCallingCode: z.string().nullable(),
  nationalNumber: z.string().nullable(),
});
export type PhoneNumber = z.infer<typeof phoneNumber>;
export const encodePhoneNumber = (pN: PhoneNumber) =>
  `+${pN.countryCallingCode} ${pN.nationalNumber}`;

export enum AuthAction {
  logIn = 0,
  register = 1,
}

export const prompts = {
  [AuthAction.logIn]: "Inicia sesión",
  [AuthAction.register]: "Regístrate",
};

export type AuthDialogState = {
  phoneNumber: PhoneNumber;
  phoneNumberInputError: boolean;
  name: string;
  maker?: PartialMaker;
  authAction: AuthAction;
  recaptchaConfirmationResult?: ConfirmationResult;
  otpDialogOpen: boolean;
  recaptchaDialogOpen: boolean;
  confirmRegistrationDialogOpen: boolean;
  checkingUserRegistered: boolean;
  userRegisteredError: boolean;
};
