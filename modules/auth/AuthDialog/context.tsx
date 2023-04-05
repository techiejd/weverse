import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { z } from "zod";
import { ConfirmationResult } from "firebase/auth";
import { formUrl } from "../../../common/context/context";

const phoneNumber = z.object({
  countryCallingCode: z.string().nullable(),
  nationalNumber: z.string().nullable(),
});

export type PhoneNumber = z.infer<typeof phoneNumber>;
export enum AuthAction {
  logIn = 0,
  register = 1,
}

export const prompts = {
  [AuthAction.logIn]: "Iniciar sesión",
  [AuthAction.register]: "Registrarme",
};

const makerType = z.enum(["individual", "organization"]);
const maker = z.object({
  type: makerType,
  pic: formUrl,
  name: z.string().min(1),
});
const partialMaker = maker.partial();
type PartialMaker = z.infer<typeof partialMaker>;

export type AuthDialogState = {
  phoneNumber: PhoneNumber;
  phoneNumberInputError: boolean;
  name?: string;
  maker?: PartialMaker;
  authAction: AuthAction;
  recaptchaConfirmationResult?: ConfirmationResult;
  otpDialogOpen: boolean;
  recaptchaDialogOpen: boolean;
  confirmRegistrationDialogOpen: boolean;
};

/**export const AuthDialogContext = createContext<AuthDialogState | undefined>(
  undefined
);

export const SetAuthDialogContext = createContext<
  Dispatch<SetStateAction<AuthDialogState | undefined>> | undefined
>(undefined);

export function useAuthDialogState() {
  return useContext(AuthDialogContext);
}

export function useSetAuthDialogState() {
  return useContext(SetAuthDialogContext);
}
*/
