import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { Currency, SponsorshipLevel } from "../../../../functions/shared/src";
import { Fragment } from "react";
import { currencyInfo, toDisplayCurrency } from "./utils";

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
  const sponsorship = [
    {
      name: "Tipo de patrocinio",
      detail:
        currencyInfo[sponsorshipIn.currency].sponsorshipLevelInfo[
          sponsorshipIn.sponsorshipLevel as SponsorshipLevel
        ].displayName,
    },
    {
      name: "Total",
      detail: toDisplayCurrency[sponsorshipIn.currency](
        Number(sponsorshipIn.total)
      ),
    },
  ];

  const customerDetails = customerDetailsIn
    ? [
        {
          name: "Titular de la tarjeta",
          detail: `${customerDetailsIn.firstName} ${customerDetailsIn.lastName}`,
        },
        { name: "Correo electrónico", detail: customerDetailsIn.email },
        { name: "Número de teléfono", detail: customerDetailsIn.phone },
        { name: "Pais", detail: customerDetailsIn.country },
        { name: "Codigo Postal", detail: customerDetailsIn.postalCode },
      ]
    : undefined;
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Resumen de patrocinio
      </Typography>
      <LineItems lineItems={sponsorship} />
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Detalles de pago
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
