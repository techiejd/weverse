import * as React from "react";
import { Fragment } from "react";
import { Step } from "./utils";

import Confirm from "./confirm";
import StepperHeader from "../common/stepperHeader";
import Final from "../common/final";
import ChooseSponsorship from "../common/chooseSponsorship";

const steps = ["Elige", "Confirma"];

const RepeatSponsor = ({
  step,
  sponsorForm,
  exitButtonBehavior,
  handleBack,
}: {
  step: number;
  sponsorForm: Record<string, string>;
  exitButtonBehavior: { href: string } | { onClick: () => void };
  handleBack: () => void;
}) => {
  const repeatSponsorStep = step as Step;
  function getStepContent() {
    const penultimateStepLoading =
      sponsorForm[Step.toString(Step.confirm)] == "loading";
    switch (repeatSponsorStep) {
      case Step.chooseSponsorship:
        return (
          <ChooseSponsorship
            sponsorForm={sponsorForm}
            exitButtonBehavior={exitButtonBehavior}
          />
        );
      case Step.confirm:
        return <Confirm sponsorForm={sponsorForm} handleBack={handleBack} />;
      case Step.success:
        return (
          <Final
            sponsorForm={sponsorForm}
            exitButtonBehavior={exitButtonBehavior}
            loading={penultimateStepLoading}
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
