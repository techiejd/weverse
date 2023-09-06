// modified from https://github.com/mui/material-ui/issues/16037
import React from "react";
import {
  AuBankAccountElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  FpxBankElement,
  IbanElement,
  IdealBankElement,
} from "@stripe/react-stripe-js";
import StripeInput from "./stripeInput";
import { TextField, TextFieldProps } from "@mui/material";
import { useTranslations } from "next-intl";

export type StripeElement =
  | typeof AuBankAccountElement
  | typeof CardCvcElement
  | typeof CardExpiryElement
  | typeof CardNumberElement
  | typeof FpxBankElement
  | typeof IbanElement
  | typeof IdealBankElement;

type StripeTextFieldProps<T extends StripeElement> = Omit<
  TextFieldProps,
  "onChange" | "inputComponent" | "inputProps"
> & {
  inputProps?: React.ComponentProps<T>;
  labelErrorMessage?: string;
  onChange?: React.ComponentProps<T>["onChange"];
  stripeElement?: T;
};

const StripeTextDefaultProps = {
  inputProps: {},
  labelErrorMessage: "",
  onChange: () => {},
  stripeElement: null,
};

export const StripeTextField = <T extends StripeElement>(
  props: StripeTextFieldProps<T>
): JSX.Element => {
  const {
    helperText,
    InputLabelProps,
    InputProps = {},
    inputProps,
    error,
    labelErrorMessage,
    stripeElement,
    ...other
  } = props;

  return (
    <TextField
      fullWidth
      variant="standard"
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      error={error}
      InputProps={{
        ...InputProps,
        // @ts-ignore
        inputProps: {
          ...inputProps,
          ...InputProps.inputProps,
          component: stripeElement,
        },
        // @ts-ignore
        inputComponent: StripeInput,
      }}
      helperText={error ? labelErrorMessage : helperText}
      {...other}
    />
  );
};

StripeTextField.defaultProps = StripeTextDefaultProps;

export function StripeTextFieldNumber(
  props: StripeTextFieldProps<typeof CardNumberElement>
): JSX.Element {
  const cardTranslations = useTranslations("common.sponsor.steps.payment.card");
  return (
    <StripeTextField
      {...props}
      label={cardTranslations("number")}
      stripeElement={CardNumberElement}
    />
  );
}

StripeTextFieldNumber.defaultProps = StripeTextDefaultProps;

export function StripeTextFieldExpiry(
  props: StripeTextFieldProps<typeof CardExpiryElement>
): JSX.Element {
  const cardTranslations = useTranslations("common.sponsor.steps.payment.card");
  return (
    <StripeTextField
      {...props}
      label={cardTranslations("expiry")}
      stripeElement={CardExpiryElement}
    />
  );
}

StripeTextFieldExpiry.defaultProps = StripeTextDefaultProps;

export function StripeTextFieldCVC(
  props: StripeTextFieldProps<typeof CardCvcElement>
): JSX.Element {
  return (
    <StripeTextField {...props} label="CVC" stripeElement={CardCvcElement} />
  );
}

StripeTextFieldCVC.defaultProps = StripeTextDefaultProps;
