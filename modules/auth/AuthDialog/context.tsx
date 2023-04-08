import { z } from "zod";
import { ConfirmationResult } from "firebase/auth";
import { formUrl } from "../../../common/context/context";

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
  [AuthAction.logIn]: "Iniciar sesión",
  [AuthAction.register]: "Registrarme",
};

const makerType = z.enum(["individual", "organization"]);
export const organizationType = z.enum([
  "nonprofit",
  "religious",
  "governmental",
  "unincorporated",
  "profit",
]);
export type OrganizationType = z.infer<typeof organizationType>;
export const organizationLabels = {
  [organizationType.Enum.nonprofit]: "Fundación u Otra ONG",
  [organizationType.Enum.religious]: "Organización Religiosa",
  [organizationType.Enum.governmental]: "Organización Gubermental",
  [organizationType.Enum.unincorporated]: "Voluntarios u Otro No Asociados",
  [organizationType.Enum.profit]: "Organización con fines de lucro",
};
export const maker = z.object({
  ownerId: z.string(),
  type: makerType,
  pic: formUrl,
  name: z.string().min(1),
  organizationType: organizationType.optional(),
});
const partialMaker = maker.partial();
type PartialMaker = z.infer<typeof partialMaker>;

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
