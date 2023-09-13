import { Stepper, StepLabel, Step } from "@mui/material";

const StepperHeader = ({ step, steps }: { step: number; steps: string[] }) => {
  return (
    <Stepper activeStep={step} sx={{ pt: 3, pb: 5 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperHeader;
