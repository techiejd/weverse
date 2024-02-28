import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  ListItem,
  ListItemText,
  NativeSelect,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import {
  feePercentage,
  paymentInfo,
  toDisplayCurrency,
  toRoundedCurrency,
} from "./utils";
import { useMyMember } from "../../../../common/context/weverseUtils";
import {
  Currency,
  Initiative,
  PaymentPlanOptions,
  SponsorshipLevel,
  sponsorshipLevel,
} from "../../../../functions/shared/src";
import { useMessages, useTranslations } from "next-intl";

const ChooseSponsorship = ({
  sponsorForm,
  exitButtonBehavior,
  beneficiary,
  currency: currencyIn,
}: {
  sponsorForm: Record<string, string>;
  exitButtonBehavior: { href: string } | { onClick: () => void };
  beneficiary: Initiative;
  currency?: Currency;
}) => {
  const messages = useMessages();
  const [myMember] = useMyMember();
  const sponsorTranslations = useTranslations("common.sponsor");
  const chooseTranslations = useTranslations("common.sponsor.steps.choose");
  const inputTranslations = useTranslations("input");
  const [currency, setCurrency] = useState<Currency>(
    currencyIn ||
      (sponsorForm.currency as Currency) ||
      (messages ? (chooseTranslations("defaultCurrency") as Currency) : "usd")
  );
  const toDisplay = toDisplayCurrency[currency];
  const toRounded = toRoundedCurrency[currency];
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanOptions>(
    (sponsorForm.paymentPlan as PaymentPlanOptions) || "monthly"
  );
  const togglePaymentPlan = () => {
    setPaymentPlan(paymentPlan == "monthly" ? "oneTime" : "monthly");
  };

  const sponsorshipLevelInfo =
    paymentInfo[currency].paymentPlanAndSponsorshipLevelInfo[paymentPlan];
  const [customAmount, setCustomAmount] = useState(
    sponsorForm.customAmount
      ? sponsorForm.customAmount
      : sponsorshipLevelInfo[sponsorshipLevel.Enum.custom].amount.toString()
  );
  const [customAmountNumber, setCustomAmountNumber] = useState(
    parseInt(customAmount)
  );
  useEffect(() => {
    setCustomAmount(
      sponsorshipLevelInfo[sponsorshipLevel.Enum.custom].amount.toString()
    );
    setCustomAmountNumber(
      sponsorshipLevelInfo[sponsorshipLevel.Enum.custom].amount
    );
  }, [sponsorshipLevelInfo]);
  const [sponsorshipLevelIn, setSponsorshipLevelIn] =
    useState<SponsorshipLevel>(
      sponsorForm.sponsorshipLevel
        ? (sponsorForm.sponsorshipLevel as SponsorshipLevel)
        : "fan"
    );

  const minCustomAmount =
    sponsorshipLevelIn === sponsorshipLevel.Enum.custom
      ? sponsorshipLevelInfo[sponsorshipLevel.Enum.custom].amount
      : 0;

  const [tipPercentage, setTipPercentage] = useState(15);
  const [initiativePaysFee, setInitiativePaysFee] = useState(
    sponsorForm.denyStripeFee === "true"
  );
  const [memberPublishable, setMemberPublishable] = useState(
    sponsorForm.memberPublishable == undefined
      ? true
      : sponsorForm.memberPublishable === "true"
  );

  const sponsorshipAmount =
    sponsorshipLevelIn == sponsorshipLevel.Enum.custom
      ? customAmountNumber
      : sponsorshipLevelInfo[sponsorshipLevelIn].amount;
  const feeAmount = (() => {
    const feeAmount =
      feePercentage * sponsorshipAmount +
      paymentInfo[currency].feeCharge.amount;
    return initiativePaysFee ? 0 : toRounded(feeAmount);
  })();
  const feeDisplayAmount = toDisplay(feeAmount);
  const flatFeeDisplayAmount = toDisplay(
    paymentInfo[currency].feeCharge.amount
  );

  const sponsorshipDisplayAmount =
    sponsorshipLevelIn == sponsorshipLevel.Enum.custom
      ? toDisplay(sponsorshipAmount)
      : sponsorshipLevelInfo[sponsorshipLevelIn].displayCurrency;

  const oneWeAmount = toRounded((sponsorshipAmount * tipPercentage) / 100);
  const tipDisplayAmount = toDisplay(oneWeAmount);

  const total = toRounded(sponsorshipAmount + feeAmount + oneWeAmount);
  const displayTotal = toDisplay(total);

  const sponsorshipLevelLabel = (sponsorshipLevelIn: SponsorshipLevel) => {
    return (
      <FormControlLabel
        value={sponsorshipLevelIn}
        control={<Radio />}
        label={`${sponsorTranslations("levels." + sponsorshipLevelIn)}: ${
          sponsorshipLevelInfo[sponsorshipLevelIn].displayCurrency
        }`}
      />
    );
  };

  const initiativeAmount = initiativePaysFee
    ? toRounded(
        (sponsorshipAmount - paymentInfo[currency].feeCharge.amount) /
          (1 + feePercentage)
      )
    : sponsorshipAmount;
  const stripeFeeAmount = toRounded(total - initiativeAmount - oneWeAmount);

  return (
    <Fragment>
      <input hidden value={"chooseSponsorship"} name="stepString" readOnly />
      <input hidden value={myMember?.path || ""} name="member" readOnly />
      <input hidden value={total} name="total" readOnly />
      <input hidden value={oneWeAmount} name="oneWeAmount" readOnly />
      <input hidden value={initiativeAmount} name="initiativeAmount" readOnly />
      <input hidden value={stripeFeeAmount} name="stripeFeeAmount" readOnly />
      <input
        hidden
        value={String(initiativePaysFee)}
        name="denyStripeFee"
        readOnly
      />
      <input
        hidden
        value={String(memberPublishable)}
        name="memberPublishable"
        readOnly
      />
      <input hidden value={beneficiary.path} name="initiative" readOnly />
      <input hidden value={paymentPlan} name="paymentPlan" readOnly />

      <Typography variant="h6" gutterBottom>
        {chooseTranslations("title")}
      </Typography>
      <Stack spacing={2} divider={<Divider />}>
        <ChooseCurrency {...{ currencyIn, currency, setCurrency }} />
        <ChoosePaymentPlan
          {...{
            paymentPlan: paymentPlan,
            togglePaymentPlan: togglePaymentPlan,
          }}
        />
        <Stack>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={sponsorTranslations("sponsorship")}
              secondary={chooseTranslations("level", {
                level: sponsorTranslations("levels." + sponsorshipLevelIn),
              })}
            />
            <Typography variant="body2">{sponsorshipDisplayAmount}</Typography>
          </ListItem>
          <ListItem>
            <FormControl>
              <RadioGroup
                name="sponsorshipLevel"
                value={sponsorshipLevelIn}
                onChange={(e) =>
                  setSponsorshipLevelIn(e.target.value as SponsorshipLevel)
                }
              >
                {sponsorshipLevelLabel(sponsorshipLevel.Enum.admirer)}
                {sponsorshipLevelLabel(sponsorshipLevel.Enum.fan)}
                {sponsorshipLevelLabel(sponsorshipLevel.Enum.lover)}
                <FormControlLabel
                  value={sponsorshipLevel.Enum.custom}
                  control={<Radio />}
                  label={
                    <Stack>
                      <TextField
                        name="customAmount"
                        value={customAmount}
                        required={
                          sponsorshipLevelIn == sponsorshipLevel.Enum.custom
                        }
                        onChange={(e) => {
                          const justNumbers = e.target.value.replace(
                            /[^0-9]*/g,
                            ""
                          );
                          setCustomAmountNumber(parseInt(justNumbers || "0"));
                          setCustomAmount(justNumbers);
                        }}
                        onKeyDown={(e) => {
                          var invalidChars = ["-", "+", "e", "."];
                          if (invalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        inputMode="numeric"
                        inputProps={{
                          min: minCustomAmount,
                          type: "number",
                        }}
                      />
                      <Typography>{toDisplay(customAmountNumber)}</Typography>
                    </Stack>
                  }
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
        </Stack>
        <Stack>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={chooseTranslations("tip.prompt")}
              secondary={
                <>
                  {chooseTranslations("tip.showUsYourLove")}
                  <br /> {chooseTranslations("tip.forTheService")}
                </>
              }
            />
            <Typography variant="body2">{tipDisplayAmount}</Typography>
          </ListItem>
          <ListItem sx={{ pt: 3, px: 2 }}>
            <Slider
              aria-label="Tip percentage"
              value={tipPercentage}
              onChange={(e, v) => setTipPercentage(v as number)}
              valueLabelDisplay="on"
              name="tipPercentage"
              step={5}
              marks={[
                { value: 0, label: "0%" },
                { value: 30, label: "30%" },
              ]}
              min={0}
              max={30}
              valueLabelFormat={(x) => `${x}%`}
            />
          </ListItem>
        </Stack>
        <Stack>
          <ListItem sx={{ pt: 1, px: 0 }}>
            <ListItemText
              primary={chooseTranslations("fee.prompt")}
              secondary={
                /*TODO(techiejd): look into formatting with next-intl*/
                chooseTranslations("fee.feeExplanation", {
                  denyFee: initiativePaysFee,
                  feePercentage: `${(feePercentage * 100).toFixed(1)}`,
                  feeAmount: flatFeeDisplayAmount,
                })
              }
            />
            <Typography variant="body2">{feeDisplayAmount}</Typography>
          </ListItem>
          <ListItem sx={{ pb: 1, px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  checked={initiativePaysFee}
                  onChange={(e) => {
                    setInitiativePaysFee(e.target.checked);
                    e.preventDefault();
                  }}
                />
              }
              label={chooseTranslations("fee.preferInitiativePays")}
            />
          </ListItem>
        </Stack>
        <Stack>
          <ListItem sx={{ pt: 1, px: 0 }}>
            <ListItemText
              primary={chooseTranslations("publicizeSupporter.prompt")}
              secondary={
                <>
                  {chooseTranslations("publicizeSupporter.initiativeKnows")}
                  <br />{" "}
                  {chooseTranslations(
                    "publicizeSupporter.publicizeSupporterExplanation"
                  )}
                </>
              }
            />
          </ListItem>
          <ListItem sx={{ pb: 1, px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  onChange={(e) => setMemberPublishable(e.target.checked)}
                  checked={memberPublishable}
                />
              }
              label={chooseTranslations("publicizeSupporter.publish")}
            />
          </ListItem>
        </Stack>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            primary={sponsorTranslations("total")}
            secondary={sponsorTranslations("monthly")}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {displayTotal}
          </Typography>
        </ListItem>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button {...exitButtonBehavior} sx={{ mt: 3 }}>
          {inputTranslations("cancel")}
        </Button>
        <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
          {inputTranslations("next")}
        </Button>
      </Box>
    </Fragment>
  );
};

export default ChooseSponsorship;

const ChoosePaymentPlan = ({
  paymentPlan,
  togglePaymentPlan,
}: {
  paymentPlan: "monthly" | "oneTime";
  togglePaymentPlan: () => void;
}) => {
  const choosePaymentPlanTranslations = useTranslations(
    "common.sponsor.steps.choose.paymentPlan"
  );
  return (
    <Stack>
      <Typography>Choose your payment plan</Typography>
      <Typography variant="body2" color="text.secondary">
        {choosePaymentPlanTranslations("explanation", {
          paymentPlan,
        })}
      </Typography>
      <div className="sponsorship-plan-colors self-stretch flex flex-col items-center justify-center p-2.5 text-center text-primary-700">
        <div className="rounded-12xl bg-primary-50 w-[297px] flex flex-row items-center justify-center py-1 pr-2.5 pl-1 box-border mix-blend-multiply">
          {paymentPlan == "monthly" ? (
            <MonthlyPaymentPlanSelected togglePaymentPlan={togglePaymentPlan} />
          ) : (
            <OneTimePaymentPlanSelected togglePaymentPlan={togglePaymentPlan} />
          )}
        </div>
      </div>
    </Stack>
  );
};

const MonthlyPaymentPlanSelected = ({
  togglePaymentPlan,
}: {
  togglePaymentPlan: () => void;
}) => {
  const choosePaymentPlanTranslations = useTranslations(
    "common.sponsor.steps.choose.paymentPlan"
  );
  return (
    <Fragment>
      <div className="flex flex-row items-center justify-center py-0 pr-0 pl-6 mix-blend-normal">
        <div className="rounded-10xl bg-white w-[163px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
          <div className="relative leading-[20px] font-semibold">
            {choosePaymentPlanTranslations("monthly")}
          </div>
        </div>
      </div>
      <div
        className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-center mix-blend-normal"
        onClick={togglePaymentPlan}
      >
        <div className="rounded-10xl w-[143px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
          <div className="relative text-sm leading-[20px] font-medium font-text-sm-regular text-primary-700 text-center">
            {choosePaymentPlanTranslations("oneTime")}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const OneTimePaymentPlanSelected = ({
  togglePaymentPlan,
}: {
  togglePaymentPlan: () => void;
}) => {
  const choosePaymentPlanTranslations = useTranslations(
    "common.sponsor.steps.choose.paymentPlan"
  );
  return (
    <Fragment>
      <div
        className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-center mix-blend-normal"
        onClick={togglePaymentPlan}
      >
        <div className="rounded-10xl w-[143px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
          <div className="relative text-sm leading-[20px] font-medium font-text-sm-regular text-primary-700 text-center">
            {choosePaymentPlanTranslations("monthly")}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center mix-blend-normal ml-[-6px]">
        <div className="rounded-10xl bg-white flex flex-row items-center justify-center py-2.5 px-8">
          <div className="relative leading-[20px] font-semibold">
            {choosePaymentPlanTranslations("oneTime")}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const ChooseCurrency = ({
  currencyIn,
  currency,
  setCurrency,
}: {
  currency?: Currency;
  setCurrency: (currency: Currency) => void;
  currencyIn?: Currency;
}) => {
  const chooseCurrencyTranslations = useTranslations(
    "common.sponsor.steps.choose.currency"
  );
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ display: currencyIn ? "none" : "flex" }}
    >
      <Stack>
        <Typography>{chooseCurrencyTranslations("prompt")}</Typography>
        <Typography variant="body2" color="text.secondary">
          {chooseCurrencyTranslations("chooseWiselyWarning")}
        </Typography>
      </Stack>
      <NativeSelect
        inputProps={{
          name: "currency",
          id: "currency",
        }}
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        disableUnderline
        sx={{
          border: "1px solid #ccc",
          borderRadius: 4,
          pl: 1,
          minWidth: 90,
        }}
      >
        <option value="cop">COP 🇨🇴</option>
        <option value="usd">USD 🇺🇸</option>
        <option value="eur">EUR 🇪🇺</option>
        <option value="gbp">GBP 🇬🇧</option>
      </NativeSelect>
    </Stack>
  );
};
