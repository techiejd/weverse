import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { sponsorshipLevels, toCop } from "./utils";
import { useMyMember } from "../../../../common/context/weverseUtils";
import {
  SponsorshipLevel,
  sponsorshipLevel,
} from "../../../../functions/shared/src";
import { useCurrentMaker } from "../../context";

const sponsorshipLevelLabel = (sponsorshipLevelIn: SponsorshipLevel) => {
  return (
    <FormControlLabel
      value={sponsorshipLevelIn}
      control={<Radio />}
      label={`${sponsorshipLevels[sponsorshipLevelIn].displayName}: ${sponsorshipLevels[sponsorshipLevelIn].displayCurrency}`}
    />
  );
};

const ChooseSponsorship = ({
  sponsorForm,
}: {
  sponsorForm: Record<string, string>;
}) => {
  const [customAmount, setCustomAmount] = useState(
    sponsorForm.customAmount
      ? sponsorForm.customAmount
      : sponsorshipLevels[sponsorshipLevel.Enum.custom].amount.toString()
  );
  const [customAmountNumber, setCustomAmountNumber] = useState(
    parseInt(customAmount)
  );
  const [sponsorshipLevelIn, setSponsorshipLevelIn] =
    useState<SponsorshipLevel>(
      sponsorForm.sponsorshipLevel
        ? (sponsorForm.sponsorshipLevel as SponsorshipLevel)
        : "fan"
    );

  const [tipPercentage, setTipPercentage] = useState(15);
  const [makerPaysFee, setMakerPaysFee] = useState(false);

  const sponsorshipAmount =
    sponsorshipLevelIn == sponsorshipLevel.Enum.custom
      ? customAmountNumber
      : sponsorshipLevels[sponsorshipLevelIn].amount;
  const feePercentage = 0.029;
  const feeCharge = 1300;
  const feeAmount = makerPaysFee
    ? 0
    : Math.ceil(feePercentage * sponsorshipAmount + feeCharge);
  const feeDisplayAmount = toCop(feeAmount);

  const sponsorshipDisplayAmount =
    sponsorshipLevelIn == sponsorshipLevel.Enum.custom
      ? toCop(sponsorshipAmount)
      : sponsorshipLevels[sponsorshipLevelIn].displayCurrency;

  const tipAmount = Math.floor((sponsorshipAmount * tipPercentage) / 100);
  const tipDisplayAmount = toCop(tipAmount);

  const total = sponsorshipAmount + feeAmount + tipAmount;
  const displayTotal = toCop(total);

  const [maker, makerLoading, makerError] = useCurrentMaker();
  const [myMember, myMemberLoading, myMemberError] = useMyMember();
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Elige tu nivel de patrocinio
      </Typography>

      <input hidden value={"chooseSponsorship"} name="stepString" readOnly />
      <input hidden value={total} name="total" readOnly />
      <input hidden value={maker?.id ?? ""} name="maker" readOnly />
      <input hidden value={myMember?.id ?? ""} name="member" readOnly />

      <Stack spacing={2} divider={<Divider />}>
        <Stack>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={"Patrocinio"}
              secondary={`Nivel ${sponsorshipLevels[sponsorshipLevelIn].displayName}`}
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
                            /[^0-9]/g,
                            ""
                          );
                          setCustomAmountNumber(parseInt(justNumbers || "0"));
                          setCustomAmount(justNumbers);
                        }}
                        inputMode="numeric"
                        inputProps={{
                          min:
                            sponsorshipLevelIn === sponsorshipLevel.Enum.custom
                              ? 20_000
                              : undefined,
                          type: "number",
                        }}
                      />
                      <Typography>{toCop(customAmountNumber)}</Typography>
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
              secondary={`${(feePercentage * 100).toFixed(1)}% + ${toCop(
                feeCharge
              )} pesos por transacción.`}
            />
            <Typography variant="body2">{feeDisplayAmount}</Typography>
          </ListItem>
          <ListItem sx={{ pb: 1, px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  name="denyFee"
                  value={makerPaysFee}
                  onChange={(e) => setMakerPaysFee(e.target.checked)}
                />
              }
              label="Prefiero que el Maker pague la tarifa."
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
        <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
          Siguiente
        </Button>
      </Box>
    </Fragment>
  );
};

export default ChooseSponsorship;
