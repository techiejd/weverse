import * as React from "react";
import CustomerDetails from "./customerDetails";
import Pay from "./pay";
import { Step } from "./utils";
import ChooseSponsorship from "../common/chooseSponsorship";
import Final from "../common/final";
import StepperHeader from "../common/stepperHeader";
import { Maker } from "../../../../functions/shared/src";

const steps = ["Elige", "Datos", "Pago"];

const InitializeSponsor = ({
  step,
  sponsorForm,
  exitButtonBehavior,
  handleBack,
  handleNext,
  beneficiary,
}: {
  step: number;
  sponsorForm: Record<string, string>;
  exitButtonBehavior: { href: string } | { onClick: () => void };
  handleBack: () => void;
  handleNext: () => void;
  beneficiary: Maker;
}) => {
  const getStepContent = () => {
    switch (step as Step) {
      case Step.chooseSponsorship:
        return (
          <ChooseSponsorship
            sponsorForm={sponsorForm}
            exitButtonBehavior={exitButtonBehavior}
            beneficiary={beneficiary}
          />
        );
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
            beneficiary={beneficiary}
          />
        );
      case Step.success:
        return (
          <Final
            exitButtonBehavior={exitButtonBehavior}
            beneficiary={beneficiary}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };
  return (
    <React.Fragment>
      <StepperHeader step={step} steps={steps} />
      {getStepContent()}
    </React.Fragment>
  );
};

export default InitializeSponsor;
