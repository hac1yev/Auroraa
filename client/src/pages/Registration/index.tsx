import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import AddressDetails from "./AddressDetails";
import IdentityVerification from "./IdentityVerification";
import ConfirmPassword from "./ConfirmPassword";

const steps = [
  {
    Component: PersonalDetails,
    label: "Personal Details",
  },
  {
    Component: ContactDetails,
    label: "Contact Details",
  },
  {
    Component: AddressDetails,
    label: "Address Details",
  },
  {
    Component: IdentityVerification,
    label: "Identity Verification",
  },
  {
    Component: ConfirmPassword,
    label: "Confirm Password",
  },
] as const;

export const RegistrationStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({});

  const totalSteps = steps.length;
  const completedSteps = Object.keys(completed).length;
  const isLastStep = activeStep === totalSteps - 1;
  const allStepsCompleted = completedSteps === totalSteps;

  const CurrentStepComponent = steps[activeStep].Component;

  const handleNext = () => {
    const newActiveStep =
      isLastStep && !allStepsCompleted
        ? steps.findIndex((_step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const previousActiveStepRef = React.useRef(activeStep);
  const previousCompletedRef = React.useRef(completed);

  React.useEffect(() => {
    const previousCompleted = previousCompletedRef.current;
    previousCompletedRef.current = completed;

    if (
      Object.keys(completed).length === 0 &&
      Object.keys(previousCompleted).length !== 0
    ) {
      nextButtonRef.current?.focus();
    }
  }, [completed, allStepsCompleted]);

  React.useEffect(() => {
    if (activeStep === 0 && previousActiveStepRef.current === 1) {
      nextButtonRef.current?.focus();
    }

    previousActiveStepRef.current = activeStep;
  }, [activeStep]);

  return (
    <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Account registration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete each step to open your account. You can jump between steps at
        any time.
      </Typography>

      <Stepper nonLinear alternativeLabel activeStep={activeStep}>
        {steps.map((item, index) => (
          <Step key={item.label} completed={completed[index]}>
            <StepButton
              aria-controls="stepper-content"
              color="inherit"
              onClick={handleStep(index)}
            >
              {item.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div id="stepper-content">
        {allStepsCompleted ? (
          <React.Fragment>
            <Paper variant="outlined" sx={{ mt: 3, p: 3 }}>
              <Typography>
                All steps completed — you&apos;re finished. Add your success
                summary here.
              </Typography>
            </Paper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Paper variant="outlined" sx={{ mt: 3, p: 3, minHeight: 160 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {steps[activeStep].label}
              </Typography>
              <CurrentStepComponent setCompleted={setCompleted} />
            </Paper>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {!isLastStep && (
                <Button
                  disabled={!completed[activeStep]}
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                  ref={nextButtonRef}
                >
                  Next
                </Button>
              )}
              {completed[activeStep] && (
                <Typography
                  variant="caption"
                  sx={{ display: "inline-block", alignSelf: "center" }}
                >
                  Step {activeStep + 1} already completed
                </Typography>
              )}
              {isLastStep && allStepsCompleted && (
                <Button onClick={handleComplete}>Finish</Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
};
