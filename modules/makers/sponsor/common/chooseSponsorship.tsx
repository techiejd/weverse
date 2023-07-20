import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
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
import { feePercentage, currencyInfo, toDisplayCurrency } from "./utils";
import { useMyMember } from "../../../../common/context/weverseUtils";
import {
  Currency,
  Maker,
  SponsorshipLevel,
  sponsorshipLevel,
} from "../../../../functions/shared/src";

const ChooseSponsorship = ({
  sponsorForm,
  exitButtonBehavior,
  beneficiary,
}: {
  sponsorForm: Record<string, string>;
  exitButtonBehavior: { href: string } | { onClick: () => void };
  beneficiary: Maker;
}) => {
  const [currency, setCurrency] = useState<Currency>(
    sponsorForm.currency ? (sponsorForm.currency as Currency) : "cop"
  );
  const sponsorshipLevelInfo = currencyInfo[currency].sponsorshipLevelInfo;
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

  const [tipPercentage, setTipPercentage] = useState(15);
  const [makerPaysFee, setMakerPaysFee] = useState(false);
  const [memberPublishable, setMemberPublishable] = useState(true);

  const sponsorshipAmount =
    sponsorshipLevelIn == sponsorshipLevel.Enum.custom
      ? customAmountNumber
      : sponsorshipLevelInfo[sponsorshipLevelIn].amount;
  const feeAmount = (() => {
    const feeAmount =
      feePercentage * sponsorshipAmount +
      currencyInfo[currency].feeCharge.amount;
    return makerPaysFee
      ? 0
      : currency == "cop"
      ? Math.ceil(feeAmount)
      : Number(feeAmount.toFixed(2));
  })();
  const feeDisplayAmount = toDisplayCurrency[currency](feeAmount);

  const sponsorshipDisplayAmount =
    sponsorshipLevelIn == sponsorshipLevel.Enum.custom
      ? toDisplayCurrency[currency](sponsorshipAmount)
      : sponsorshipLevelInfo[sponsorshipLevelIn].displayCurrency;

  const tipAmount = (() => {
    return currency == "cop"
      ? Math.ceil((sponsorshipAmount * tipPercentage) / 100)
      : Number(((sponsorshipAmount * tipPercentage) / 100).toFixed(2));
  })();
  const tipDisplayAmount = toDisplayCurrency[currency](tipAmount);

  const total = sponsorshipAmount + feeAmount + tipAmount;
  const displayTotal = toDisplayCurrency[currency](total);

  const [myMember] = useMyMember();

  const sponsorshipLevelLabel = (sponsorshipLevelIn: SponsorshipLevel) => {
    return (
      <FormControlLabel
        value={sponsorshipLevelIn}
        control={<Radio />}
        label={`${sponsorshipLevelInfo[sponsorshipLevelIn].displayName}: ${sponsorshipLevelInfo[sponsorshipLevelIn].displayCurrency}`}
      />
    );
  };

  return (
    <Fragment>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Escoge tu divisa</Typography>
        <NativeSelect
          inputProps={{
            name: "currency",
            id: "currency",
          }}
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          disableUnderline
          sx={{ border: "1px solid #ccc", borderRadius: 4, pl: 1 }}
        >
          <option value="cop">COP 🇨🇴</option>
          <option value="usd">USD 🇺🇸</option>
          <option value="eur">EUR 🇪🇺</option>
          <option value="gbp">GBP 🇬🇧</option>
        </NativeSelect>
      </Stack>
      <Typography variant="h6" gutterBottom>
        Elige tu nivel de patrocinio
      </Typography>

      <input hidden value={"chooseSponsorship"} name="stepString" readOnly />
      <input hidden value={total} name="total" readOnly />
      <input hidden value={beneficiary.id} name="maker" readOnly />
      <input hidden value={myMember?.id ?? ""} name="member" readOnly />

      <Stack spacing={2} divider={<Divider />}>
        <Stack>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={"Patrocinio"}
              secondary={`Nivel ${sponsorshipLevelInfo[sponsorshipLevelIn].displayName}`}
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
                          min:
                            sponsorshipLevelIn === sponsorshipLevel.Enum.custom
                              ? sponsorshipLevelInfo[
                                  sponsorshipLevel.Enum.custom
                                ].amount
                              : undefined,
                          type: "number",
                        }}
                      />
                      <Typography>
                        {toDisplayCurrency[currency](customAmountNumber)}
                      </Typography>
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
              primary={"Propina a OneWe"}
              secondary={
                <>
                  ¡Muéstranos!, cuánto nos amas. <br /> Por los servicios
                  brindados en la plataforma.
                </>
              }
            />
            <Typography variant="body2">{tipDisplayAmount}</Typography>
          </ListItem>
          <ListItem sx={{ pt: 3, px: 2 }}>
            <Slider
              aria-label="Tip amount"
              value={tipPercentage}
              onChange={(e, v) => setTipPercentage(v as number)}
              valueLabelDisplay="on"
              name="tipAmount"
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
              primary={"Tarifa a la pasarela de pagos"}
              secondary={`${(feePercentage * 100).toFixed(1)}% + ${
                currencyInfo[currency].feeCharge.displayAmount
              } pesos por transacción.`}
            />
            <Typography variant="body2">{feeDisplayAmount}</Typography>
          </ListItem>
          <ListItem sx={{ pb: 1, px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  name="denyFee"
                  checked={makerPaysFee}
                  onChange={(e) => setMakerPaysFee(e.target.checked)}
                />
              }
              label="Prefiero que el Maker pague la tarifa."
            />
          </ListItem>
        </Stack>
        <Stack>
          <ListItem sx={{ pt: 1, px: 0 }}>
            <ListItemText
              primary={"¿Le contamos a la comunidad OneWe?"}
              secondary={"El o la Maker siempre sabrá quien le patrocina."}
            />
          </ListItem>
          <ListItem sx={{ pb: 1, px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  name="memberPublishable"
                  onChange={(e) => setMemberPublishable(e.target.checked)}
                  checked={memberPublishable}
                />
              }
              label="Quiero que la comunidad OneWe sepa que yo apoyo a este o esta Maker."
            />
          </ListItem>
        </Stack>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" secondary={"Al mes"} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {displayTotal}
          </Typography>
        </ListItem>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button {...exitButtonBehavior} sx={{ mt: 3 }}>
          Cancelar
        </Button>
        <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
          Siguiente
        </Button>
      </Box>
    </Fragment>
  );
};

export default ChooseSponsorship;
