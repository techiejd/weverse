import * as React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import { Step as StepComponent } from "@mui/material";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import ChooseSponsorship from "./chooseSponsorship";
import { useRouter } from "next/router";
import { useState } from "react";
import Final from "./final";
import { useCurrentMaker } from "../context";
import CustomerDetails from "./customerDetails";
import Pay from "./pay";
import { Step } from "./utils";

const steps = ["Elige", "Datos", "Pago"];

export default function Sponsor({
  finishedButtonBehavior,
}: {
  finishedButtonBehavior: { href: string } | { onClick: () => void };
}) {
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { sponsorStep } = query;
  const [activeStep, setActiveStep] = React.useState(Step.chooseSponsorship);
  const [maker, makerLoading, makerErrors] = useCurrentMaker();
  React.useEffect(() => {
    if (isReady) {
      setActiveStep(sponsorStep ? parseInt(sponsorStep as string) : 0);
    }
  }, [sponsorStep, isReady, setActiveStep]);
  const handleNext = () => {
    router.push(
      {
        pathname: `/makers/${maker?.id}/sponsor`,
        query: { sponsorStep: Step.next(activeStep) },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleBack = () => {
    router.back();
  };

  const [sponsorForm, setSponsorForm] = useState<Record<string, string>>({});
  function getStepContent() {
    switch (activeStep as Step) {
      case Step.chooseSponsorship:
        return <ChooseSponsorship sponsorForm={sponsorForm} />;
      case Step.customerDetails:
        return (
          <CustomerDetails sponsorForm={sponsorForm} handleBack={handleBack} />
        );
      case Step.pay:
        return (
          <Pay
            sponsorForm={sponsorForm}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case Step.success:
        return (
          <Final
            sponsorForm={sponsorForm}
            finishedButtonBehavior={finishedButtonBehavior}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const submit = (step: Step, sponsorForm: Record<string, string>) => {
    const stepString = Step.toString(step);
    setSponsorForm((sponsorForm) => ({
      ...sponsorForm,
      status: "loading",
      [stepString]: "loading",
    }));
    fetch("/api/sponsor?" + new URLSearchParams({ step: stepString }), {
      method: "POST",
      body: JSON.stringify(sponsorForm),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setSponsorForm((sponsorForm) => {
            Object.entries(data).forEach(([key, value]) => {
              sponsorForm[key] = value as string;
            });
            return {
              ...sponsorForm,
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
            setSponsorForm((sponsorForm) => {
              return newSponsorForm;
            });
            submit(activeStep, newSponsorForm);

            e.preventDefault();
            e.stopPropagation();

            handleNext();
            return false;
          }}
        >
          <Typography component="h1" variant="h4" align="center">
            Patrocina a {maker?.name}
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <StepComponent key={label}>
                <StepLabel>{label}</StepLabel>
              </StepComponent>
            ))}
          </Stepper>
          {getStepContent()}
        </form>
      </Paper>
    </Container>
  );
}
