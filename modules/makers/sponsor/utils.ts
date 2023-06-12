import { z } from "zod";
import { SponsorshipLevel, sponsorshipLevel } from "../../../functions/shared/src";

export const sponsorshipLevels: Record<
  SponsorshipLevel,
  { displayName: string; amount: number; displayCurrency: string }
> = (() => {
  const start = {
    [sponsorshipLevel.Enum.admirer]: { displayName: "Admirador", amount: 5_000 },
    [sponsorshipLevel.Enum.fan]: { displayName: "Aficionado", amount: 10_000 },
    [sponsorshipLevel.Enum.lover]: { displayName: "Enamorado", amount: 15_000 },
    [sponsorshipLevel.Enum.custom]: { displayName: "Personalizado", amount: 20_000 },
  };

  return Object.entries(start).reduce((acc, [key, value]) => {
    acc[key as SponsorshipLevel] = {...value, displayCurrency: value.amount.toLocaleString("es-CO", {style: "currency", currency: "COP"})};
    return acc;
  }, {} as Record<SponsorshipLevel, { displayName: string; amount: number; displayCurrency: string }>);
})();

export const toCop = (amount: number) => amount.toLocaleString("es-CO", {style: "currency", currency: "COP"});

export const documentType = z.enum(["CC", "CE", "PPN", "SSN", "LIC", "DNI", "NIT"]);
export type DocumentType = z.infer<typeof documentType>;

export const documentDisplayNames : Record<DocumentType, string> = {
  CC: "Cédula de ciudadanía",
  CE: "Cédula de extranjería",
  PPN: "Pasaporte",
  SSN: "Social Security Number",
  LIC: "Licencia de conducción",
  DNI: "Documento nacional de identidad",
  NIT: "NIT",
};

export enum Step {
  chooseSponsorship = 0,
  customerDetails = 1,
  pay = 2,
  success = 3,
}

export namespace Step {
  export function next(step: Step) {
    return step + 1;
  }
  export function previous(step: Step) {
    return step - 1;
  }
  export function toString(step: Step) {
    return Step[step];
  }
  export function toStep(step: string): Step {
    return (Step as any)[step];
  }
}