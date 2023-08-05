import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { Currency, SponsorshipLevel } from "../../../../functions/shared/src";
import { Fragment } from "react";
import { currencyInfo, toDisplayCurrency } from "./utils";
import { useTranslations } from "next-intl";

const LineItems = ({
  lineItems,
}: {
  lineItems: { name: string; detail: string }[];
}) => {
  return (
    <Grid container>
      {lineItems.map((lineItem) => (
        <Fragment key={lineItem.name}>
          <Grid item xs={6}>
            <Typography gutterBottom>{lineItem.name}:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                gutterBottom
                fontWeight="bold"
                sx={{ overflowWrap: "break-word" }}
              >
                {lineItem.detail}
              </Typography>
            </Box>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
};

const Details = ({
  sponsorship: sponsorshipIn,
  customerDetails: customerDetailsIn,
}: {
  sponsorship: { sponsorshipLevel: string; total: string; currency: Currency };
  customerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    postalCode: string;
  };
}) => {
  const inputTranslations = useTranslations("input");
  const sponsorTranslations = useTranslations("common.sponsor");
  const sponsorship = [
    {
      name: sponsorTranslations("details.sponsorshipSummary.level"),
      detail: sponsorTranslations("levels." + sponsorshipIn.sponsorshipLevel),
    },
    {
      name: sponsorTranslations("total"),
      detail: toDisplayCurrency[sponsorshipIn.currency](
        Number(sponsorshipIn.total)
      ),
    },
  ];

  const customerDetails = customerDetailsIn
    ? [
        {
          name: sponsorTranslations("details.payment.holder"),
          detail: `${customerDetailsIn.firstName} ${customerDetailsIn.lastName}`,
        },
        { name: inputTranslations("email"), detail: customerDetailsIn.email },
        {
          name: inputTranslations("phoneNumber"),
          detail: customerDetailsIn.phone,
        },
        {
          name: inputTranslations("country"),
          detail: customerDetailsIn.country,
        },
        {
          name: inputTranslations("postalCode"),
          detail: customerDetailsIn.postalCode,
        },
      ]
    : undefined;
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        {sponsorTranslations("details.sponsorshipSummary.title")}
      </Typography>
      <LineItems lineItems={sponsorship} />
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        {sponsorTranslations("details.payment.title")}
      </Typography>
      {customerDetails ? (
        <LineItems lineItems={customerDetails} />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};

export default Details;
