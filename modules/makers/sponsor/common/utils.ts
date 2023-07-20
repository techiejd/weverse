import {
  Currency,
  SponsorshipLevel,
  sponsorshipLevel,
} from "../../../../functions/shared/src";

const toCop = (amount: number) =>
  amount.toLocaleString("es-CO", { style: "currency", currency: "COP" });
const toUsd = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
const toEur = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "EUR" });
const toGbp = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "GBP" });

export const toDisplayCurrency = {
  cop: toCop,
  usd: toUsd,
  eur: toEur,
  gbp: toGbp,
};

type CurrencyInfo = Record<
  Currency,
  {
    feeCharge: { amount: number; displayAmount: string };
    sponsorshipLevelInfo: Record<
      SponsorshipLevel,
      { displayName: string; amount: number; displayCurrency: string }
    >;
  }
>;

export const currencyInfo: CurrencyInfo = (() => {
  const displayNames = {
    [sponsorshipLevel.Enum.admirer]: "Admirador",
    [sponsorshipLevel.Enum.fan]: "Aficionado",
    [sponsorshipLevel.Enum.lover]: "Aficionado",
    [sponsorshipLevel.Enum.custom]: "Aficionado",
  };
  const applySponsorshipLevelInfo = (
    currency: "cop" | "usd" | "eur" | "gbp",
    sponsorshipLevelInfo: Record<SponsorshipLevel, number>
  ) =>
    Object.entries(sponsorshipLevelInfo).reduce((acc, [key, value]) => {
      acc[key as SponsorshipLevel] = {
        amount: value,
        displayName: displayNames[key as SponsorshipLevel],
        displayCurrency: toDisplayCurrency[currency](value),
      };
      return acc;
    }, {} as Record<SponsorshipLevel, { displayName: string; amount: number; displayCurrency: string }>);
  const copAmounts = {
    [sponsorshipLevel.Enum.admirer]: 5_000,
    [sponsorshipLevel.Enum.fan]: 10_000,
    [sponsorshipLevel.Enum.lover]: 15_000,
    [sponsorshipLevel.Enum.custom]: 20_000,
  };
  const otherAmounts = {
    [sponsorshipLevel.Enum.admirer]: 5,
    [sponsorshipLevel.Enum.fan]: 10,
    [sponsorshipLevel.Enum.lover]: 15,
    [sponsorshipLevel.Enum.custom]: 20,
  };
  const feeCharges = { cop: 1300, usd: 0.3, eur: 0.3, gbp: 0.25 };

  const sponsorshipLevelInfo = {
    cop: applySponsorshipLevelInfo("cop", copAmounts),
    usd: applySponsorshipLevelInfo("usd", otherAmounts),
    eur: applySponsorshipLevelInfo("eur", otherAmounts),
    gbp: applySponsorshipLevelInfo("gbp", otherAmounts),
  };

  const currencyInfo = Object.entries(feeCharges).reduce(
    (acc, [key, value]) => {
      acc[key as "cop" | "usd" | "eur" | "gbp"] = {
        feeCharge: {
          amount: value,
          displayAmount:
            toDisplayCurrency[key as "cop" | "usd" | "eur" | "gbp"](value),
        },
        sponsorshipLevelInfo:
          sponsorshipLevelInfo[key as "cop" | "usd" | "eur" | "gbp"],
      };
      return acc;
    },
    {} as CurrencyInfo
  );
  return currencyInfo;
})();

export const feePercentage = 0.029;
