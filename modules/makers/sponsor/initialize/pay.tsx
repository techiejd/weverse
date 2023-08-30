import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { doc, writeBatch } from "firebase/firestore";
import {
  StripeTextFieldCVC,
  StripeTextFieldExpiry,
  StripeTextFieldNumber,
} from "./stripeTextFields";
import {
  useStripe,
  useElements,
  CardNumberElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAppState } from "../../../../common/context/appState";
import { useMyMember } from "../../../../common/context/weverseUtils";
import {
  useSponsorshipConverter,
  useMemberConverter,
} from "../../../../common/utils/firebase";
import { Step } from "./utils";
import Details from "../common/details";
import { Maker } from "../../../../functions/shared/src";
import { useTranslations } from "next-intl";

const Pay = ({
  sponsorForm,
  handleBack,
  handleNext,
  beneficiary,
}: {
  sponsorForm: Record<string, string>;
  handleBack: () => void;
  handleNext: () => void;
  beneficiary: Maker;
}) => {
  const appState = useAppState();

  const StripePortal = () => {
    const memberConverter = useMemberConverter();
    const sponsorshipConverter = useSponsorshipConverter();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [myMember] = useMyMember();

    const [cc, setCC] = useState({
      cardNumberComplete: false,
      expiredComplete: false,
      cvcComplete: false,
      cardNumberError: undefined,
      expiredError: undefined,
      cvcError: undefined,
    });

    const onElementChange =
      (field: string, errorField: string) =>
      ({
        complete,
        error = { message: null },
      }: {
        complete: boolean;
        error?: { message: null | string };
      }) => {
        setCC((cc) => ({
          ...cc,
          [field]: complete,
          [errorField]: error.message,
        }));
      };

    const { cardNumberError, expiredError, cvcError } = cc;
    const handleSubmit: React.MouseEventHandler = async (event) => {
      const submit = async () => {
        if (elements == null || myMember == undefined) {
          return;
        }

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
          // Show error to your customer
          setErrorMessage(submitError.message!);
          return;
        }

        const { error, paymentIntent } = await stripe!.confirmCardPayment(
          sponsorForm.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardNumberElement)!,
              billing_details: {
                name: `${sponsorForm.firstName} ${sponsorForm.lastName}`,
                email: sponsorForm.email,
                phone: sponsorForm.phone,
                address: {
                  country: sponsorForm.countryCode,
                  postal_code: sponsorForm.postalCode,
                },
              },
            },
          }
        );

        if (error) {
          setErrorMessage(error.message!);
          return;
        }

        const batch = writeBatch(appState.firestore);
        const updateSponsorshipData = {
          paymentsStarted: new Date(paymentIntent!.created * 1000),
        };
        batch.update(
          doc(
            appState.firestore,
            "makers",
            beneficiary.id!,
            "sponsorships",
            myMember.id!
          ).withConverter(sponsorshipConverter),
          updateSponsorshipData
        );
        batch.update(
          doc(
            appState.firestore,
            "members",
            myMember.id!,
            "sponsorships",
            beneficiary.id!
          ).withConverter(sponsorshipConverter),
          updateSponsorshipData
        );

        batch.update(
          doc(appState.firestore, "members", myMember.id!).withConverter(
            memberConverter
          ),
          { "stripe.status": "active" }
        );

        await batch.commit();
        handleNext();
      };

      event.preventDefault();
      setSubmitting(true);
      await submit();
      setSubmitting(false);
    };

    const prevStepLoading =
      sponsorForm[Step.toString(Step.chooseSponsorship)] == "loading";

    const loading = submitting || prevStepLoading;
    const disableSubmit =
      !cc.cardNumberComplete ||
      !cc.expiredComplete ||
      !cc.cvcComplete ||
      loading;

    const inputTranslations = useTranslations("input");
    return (
      <React.Fragment>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <StripeTextFieldNumber
              error={Boolean(cardNumberError)}
              labelErrorMessage={cardNumberError}
              onChange={onElementChange(
                "cardNumberComplete",
                "cardNumberError"
              )}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StripeTextFieldExpiry
              error={Boolean(expiredError)}
              labelErrorMessage={expiredError}
              onChange={onElementChange("expiredComplete", "expiredError")}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StripeTextFieldCVC
              error={Boolean(cvcError)}
              labelErrorMessage={cvcError}
              onChange={onElementChange("cvcComplete", "cvcError")}
            />
          </Grid>
        </Grid>
        {errorMessage && (
          <Box>
            <Typography color={"red"}>{errorMessage}</Typography>
            <Typography color="red">Por favor mirar datos.</Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <React.Fragment>
            <LoadingButton
              onClick={handleBack}
              sx={{ mt: 3, ml: 1 }}
              disabled={loading}
              loading={loading}
            >
              <span>{inputTranslations("back")}</span>
            </LoadingButton>
            <LoadingButton
              variant="contained"
              sx={{ mt: 3, ml: 1 }}
              onClick={handleSubmit}
              disabled={disableSubmit}
              loading={loading}
            >
              <span>{inputTranslations("ok")}</span>
            </LoadingButton>
          </React.Fragment>
        </Box>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Details
        customerDetails={sponsorForm as any}
        sponsorship={sponsorForm as any}
      />
      <Elements stripe={appState.getStripe()}>
        <StripePortal />
      </Elements>
    </React.Fragment>
  );
};

export default Pay;
