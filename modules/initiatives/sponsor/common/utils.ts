import {
  Currency,
  PaymentPlanOptions,
  SponsorshipLevel,
  sponsorshipLevel,
} from "../../../../functions/shared/src";

// TODO(techiejd): Move this to be done in translations (next-intl useFormatting).
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

type PaymentInfo = {
  [currency in Currency]: {
    feeCharge: { amount: number; displayAmount: string };
    paymentPlanAndSponsorshipLevelInfo: {
      [paymentPlanOption in PaymentPlanOptions]: {
        [sponsorshipLevel in SponsorshipLevel]: {
          amount: number;
          displayCurrency: string;
        };
      };
    };
  };
};

const paymentPlanMultiplier = {
  monthly: 1,
  oneTime: 6,
};

export const paymentInfo: PaymentInfo = (() => {
  const formatPaymentPlanAndSponsorshipLevelInfo = (
    currency: "cop" | "usd" | "eur" | "gbp",
    sponsorshipLevelInfo: Record<SponsorshipLevel, number>
  ) =>
    Object.entries(paymentPlanMultiplier).reduce(
      (acc, [paymentPlanOption, multiplier]) => {
        acc[paymentPlanOption as PaymentPlanOptions] = Object.entries(
          sponsorshipLevelInfo
        ).reduce((acc, [sponsorshipLevel, amount]) => {
          acc[sponsorshipLevel as SponsorshipLevel] = {
            amount: amount * multiplier,
            displayCurrency: toDisplayCurrency[currency](amount * multiplier),
          };
          return acc;
        }, {} as Record<SponsorshipLevel, { amount: number; displayCurrency: string }>);
        return acc;
      },
      {} as Record<
        PaymentPlanOptions,
        Record<SponsorshipLevel, { amount: number; displayCurrency: string }>
      >
    );
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
    cop: formatPaymentPlanAndSponsorshipLevelInfo("cop", copAmounts),
    usd: formatPaymentPlanAndSponsorshipLevelInfo("usd", otherAmounts),
    eur: formatPaymentPlanAndSponsorshipLevelInfo("eur", otherAmounts),
    gbp: formatPaymentPlanAndSponsorshipLevelInfo("gbp", otherAmounts),
  };

  const currencyInfo = Object.entries(feeCharges).reduce(
    (acc, [key, value]) => {
      acc[key as "cop" | "usd" | "eur" | "gbp"] = {
        feeCharge: {
          amount: value,
          displayAmount:
            toDisplayCurrency[key as "cop" | "usd" | "eur" | "gbp"](value),
        },
        paymentPlanAndSponsorshipLevelInfo:
          sponsorshipLevelInfo[key as "cop" | "usd" | "eur" | "gbp"],
      };
      return acc;
    },
    {} as PaymentInfo
  );
  return currencyInfo;
})();

export const feePercentage = 0.029;
