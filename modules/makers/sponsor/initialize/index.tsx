import * as React from "react";
import CustomerDetails from "./customerDetails";
import Pay from "./pay";
import { Step } from "./utils";
import ChooseSponsorship from "../common/chooseSponsorship";
import Final from "../common/final";
import StepperHeader from "../common/stepperHeader";

const steps = ["Elige", "Datos", "Pago"];

const InitializeSponsor = ({
  step,
  sponsorForm,
  finishedButtonBehavior,
  handleBack,
  handleNext,
}: {
  step: number;
  sponsorForm: Record<string, string>;
  finishedButtonBehavior: { href: string } | { onClick: () => void };
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const getStepContent = () => {
    switch (step as Step) {
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
  };
  return (
    <React.Fragment>
      <StepperHeader step={step} steps={steps} />
      {getStepContent()}
    </React.Fragment>
  );
};

export default InitializeSponsor;
