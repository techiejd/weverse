import { Fragment, useEffect, useState } from "react";
import Details from "../common/details";
import { useMyMember } from "../../../../common/context/weverseUtils";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Step } from "./utils";
import { useTranslations } from "next-intl";

const MustGoBackToSelectSponsorshipWithSavedCurrencyDialog = ({
  open,
  handleBack,
}: {
  open: boolean;
  handleBack: () => void;
}) => {
  const inputTranslations = useTranslations("input");
  const confirmTranslations = useTranslations("common.sponsor.steps.confirm");
  return (
    <Dialog open={open}>
      <DialogTitle>{confirmTranslations("mustGoBackTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {confirmTranslations("currencyMismatchExplanation")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>{inputTranslations("back")}</Button>
      </DialogActions>
    </Dialog>
  );
};

const Confirm = ({
  sponsorForm,
  handleBack,
}: {
  sponsorForm: Record<string, string>;
  handleBack: () => void;
}) => {
  const inputTranslations = useTranslations("input");
  const [myMember] = useMyMember();

  const prevStepLoading =
    sponsorForm[Step.toString(Step.chooseSponsorship)] == "loading";

  const [mustGoBackToFixCurrency, setMustGoBackToFixCurrency] = useState(false);
  useEffect(() => {
    const selectedCurrency = sponsorForm.currency;
    const persistedCurrency = myMember?.customer?.currency;
    if (persistedCurrency && persistedCurrency != selectedCurrency) {
      // This must have been selected before signing in.
      setMustGoBackToFixCurrency(true);
    }
  }, [myMember?.customer?.currency, prevStepLoading, sponsorForm.currency]);

  const loading = !myMember || prevStepLoading;
  return (
    <Fragment>
      <MustGoBackToSelectSponsorshipWithSavedCurrencyDialog
        open={mustGoBackToFixCurrency}
        handleBack={handleBack}
      />
      <input hidden value={"confirm"} name="stepString" readOnly />
      <input
        hidden
        value={myMember?.stripe?.customer?.id || ""}
        name="customer"
        readOnly
      />
      <input
        hidden
        value={myMember?.stripe?.customer?.paymentMethod || ""}
        name="paymentMethod"
        readOnly
      />
      <Details
        sponsorship={sponsorForm as any}
        customerDetails={
          !myMember
            ? undefined
            : {
                ...myMember.customer!,
                country: myMember.customer!.address!.country,
                postalCode: myMember.customer!.address!.postalCode,
              }
        }
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Fragment>
          <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
            <span>{inputTranslations("back")}</span>
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ mt: 3, ml: 1 }}
            disabled={loading}
            loading={loading}
          >
            <span>{inputTranslations("ok")}</span>
          </LoadingButton>
        </Fragment>
      </Box>
    </Fragment>
  );
};

export default Confirm;
