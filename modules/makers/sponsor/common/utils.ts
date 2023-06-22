import { SponsorshipLevel, sponsorshipLevel } from "../../../../functions/shared/src";


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