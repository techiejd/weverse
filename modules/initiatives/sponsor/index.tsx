import * as React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMyMember } from "../../../common/context/weverseUtils";
import InitializeSponsor from "./initialize";
import RepeatSponsor from "./repeat";
import { Initiative } from "../../../functions/shared/src";
import { useTranslations } from "next-intl";
import UnderConstruction from "../../posi/underConstruction";
import { Button, Stack } from "@mui/material";

export default function Sponsor({
  exitButtonBehavior,
  beneficiary,
}: {
  exitButtonBehavior: { href: string } | { onClick: () => void };
  //TODO(techiejd): This isn't necessary if we move posi under initiatives/initiative
  beneficiary: Initiative;
}) {
  const sponsorTranslations = useTranslations("common.sponsor");
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { sponsorStep, ...queryOthers } = query;
  const currPath = router.asPath.split("?")[0];
  const [activeStep, setActiveStep] = React.useState(0);
  const [myMember] = useMyMember();
  const [hasCustomerDetails, setHasCustomerDetails] = useState<
    boolean | undefined
  >();
  React.useEffect(() => {
    if (hasCustomerDetails === undefined && myMember) {
      setHasCustomerDetails(myMember?.stripe?.customer?.status == "confirmed");
    }
  }, [myMember, hasCustomerDetails]);
  React.useEffect(() => {
    if (isReady) {
      setActiveStep(sponsorStep ? parseInt(sponsorStep as string) : 0);
    }
  }, [sponsorStep, isReady, setActiveStep]);
  const handleNext = () => {
    router.push(
      {
        pathname: currPath,
        query: { sponsorStep: activeStep + 1, ...queryOthers },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleBack = () => {
    router.back();
  };

  const [sponsorForm, setSponsorForm] = useState<Record<string, string>>({
    initiative: beneficiary.path || "",
    destinationAccount: beneficiary.connectedAccount?.stripeAccountId || "",
  });

  const submit = (sponsorFormIn: Record<string, string>) => {
    const stepString = sponsorFormIn.stepString;
    if (stepString == "chooseSponsorship") {
      setSponsorForm({
        ...sponsorFormIn,
        status: "success",
        [stepString]: "success",
      });
      return;
    }
    setSponsorForm({
      ...sponsorFormIn,
      status: "loading",
      [stepString]: "loading",
    });
    fetch(
      `/api/sponsor/?` +
        new URLSearchParams({
          step: stepString,
          sponsorState: hasCustomerDetails ? "repeat" : "initialize",
        }),
      {
        method: "POST",
        body: JSON.stringify(sponsorFormIn),
      }
    ).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setSponsorForm((sponsorForm) => {
            const newSponsorForm = { ...sponsorForm };
            Object.entries(data).forEach(([key, value]) => {
              newSponsorForm[key] = value as string;
            });
            return {
              ...newSponsorForm,
              status: "success",
              [stepString]: "success",
            };
          });
        });
      } else {
        throw new Error(res.statusText);
      }
    });
  };

  if (!beneficiary.path || !beneficiary.connectedAccount?.stripeAccountId) {
    return (
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="h4">
          This initiative is not set up for sponsorship
        </Typography>
        <UnderConstruction />
        <Button href="/" variant="contained" color="primary">
          Go home
        </Button>
      </Stack>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <form
          action={"/api/sponsor"}
          onSubmit={(e) => {
            const form = new FormData(e.target as HTMLFormElement);
            const newSponsorForm = { ...sponsorForm };
            form.forEach((value, key) => {
              newSponsorForm[key] = value as string;
            });
            setSponsorForm(newSponsorForm);
            submit(newSponsorForm);

            e.preventDefault();
            e.stopPropagation();

            handleNext();
            return false;
          }}
        >
          <Typography component="h1" variant="h4" align="center">
            {sponsorTranslations("title", { initiativeName: beneficiary.name })}
          </Typography>
          {hasCustomerDetails ? (
            <RepeatSponsor
              step={activeStep}
              sponsorForm={sponsorForm}
              exitButtonBehavior={exitButtonBehavior}
              handleBack={handleBack}
              beneficiary={beneficiary}
            />
          ) : (
            <InitializeSponsor
              step={activeStep}
              sponsorForm={sponsorForm}
              exitButtonBehavior={exitButtonBehavior}
              handleBack={handleBack}
              handleNext={handleNext}
              beneficiary={beneficiary}
            />
          )}
        </form>
      </Paper>
    </Container>
  );
}
