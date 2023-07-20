import * as React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMyMemberOnce } from "../../../common/context/weverseUtils";
import InitializeSponsor from "./initialize";
import RepeatSponsor from "./repeat";
import { Maker } from "../../../functions/shared/src";

export default function Sponsor({
  exitButtonBehavior,
  beneficiary,
}: {
  exitButtonBehavior: { href: string } | { onClick: () => void };
  //TODO(techiejd): This isn't necessary if we move posi under makers/maker
  beneficiary: Maker;
}) {
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { sponsorStep, makerId, ...queryOthers } = query;
  const currPath = router.asPath.split("?")[0];
  const [activeStep, setActiveStep] = React.useState(0);
  const [myMember, myMemberLoading, myMemberErrors] = useMyMemberOnce();
  const isRepeatSponsor = myMember?.stripe?.status === "active";
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

  const [sponsorForm, setSponsorForm] = useState<Record<string, string>>({});

  const submit = (sponsorForm: Record<string, string>) => {
    const stepString = sponsorForm.stepString;
    setSponsorForm((sponsorForm) => ({
      ...sponsorForm,
      status: "loading",
      [stepString]: "loading",
    }));
    fetch(
      `/api/sponsor/?` +
        new URLSearchParams({
          step: stepString,
          sponsorState: isRepeatSponsor ? "repeat" : "initialize",
        }),
      {
        method: "POST",
        body: JSON.stringify(sponsorForm),
      }
    ).then((res) => {
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
            setSponsorForm(newSponsorForm);
            console.log(newSponsorForm);
            submit(newSponsorForm);

            e.preventDefault();
            e.stopPropagation();

            handleNext();
            return false;
          }}
        >
          <Typography component="h1" variant="h4" align="center">
            Patrocina a {beneficiary.name}
          </Typography>
          {isRepeatSponsor ? (
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
