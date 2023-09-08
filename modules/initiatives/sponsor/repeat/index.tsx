import * as React from "react";
import { Fragment } from "react";
import { Step } from "./utils";

import Confirm from "./confirm";
import StepperHeader from "../common/stepperHeader";
import Final from "../common/final";
import ChooseSponsorship from "../common/chooseSponsorship";
import { Initiative } from "../../../../functions/shared/src";
import { useMyMember } from "../../../../common/context/weverseUtils";
import { CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";

const RepeatSponsor = ({
  step,
  sponsorForm,
  exitButtonBehavior,
  handleBack,
  beneficiary,
}: {
  step: number;
  sponsorForm: Record<string, string>;
  exitButtonBehavior: { href: string } | { onClick: () => void };
  handleBack: () => void;
  beneficiary: Initiative;
}) => {
  const sponsorTranslations = useTranslations("common.sponsor");
  const steps = [
    sponsorTranslations("steps.choose.short"),
    sponsorTranslations("steps.confirm.short"),
  ];
  const repeatSponsorStep = step as Step;
  const [myMember] = useMyMember();
  function getStepContent() {
    const penultimateStepLoading =
      sponsorForm[Step.toString(Step.confirm)] == "loading";
    switch (repeatSponsorStep) {
      case Step.chooseSponsorship:
        return (
          (myMember && (
            <ChooseSponsorship
              sponsorForm={sponsorForm}
              exitButtonBehavior={exitButtonBehavior}
              beneficiary={beneficiary}
              currency={myMember.customer!.currency}
            />
          )) || <CircularProgress />
        );
      case Step.confirm:
        return <Confirm sponsorForm={sponsorForm} handleBack={handleBack} />;
      case Step.success:
        return (
          <Final
            exitButtonBehavior={exitButtonBehavior}
            loading={penultimateStepLoading}
            beneficiary={beneficiary}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <Fragment>
      <StepperHeader step={step} steps={steps} />
      {getStepContent()}
    </Fragment>
  );
};

export default RepeatSponsor;
