import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { z } from "zod";
import { ConfirmationResult } from "firebase/auth";

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

export type AuthDialogState = {
  phoneNumber: PhoneNumber;
  phoneNumberInputError: boolean;
  name?: string;
  isMaker: boolean;
  authAction: AuthAction;
  recaptchaConfirmationResult?: ConfirmationResult;
  otpDialogOpen: boolean;
  registerConfirmDialogOpen: boolean;
}

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
