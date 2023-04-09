import { z } from "zod";
import { formUrl } from "./context";

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
export type PartialMaker = z.infer<typeof partialMaker>;
