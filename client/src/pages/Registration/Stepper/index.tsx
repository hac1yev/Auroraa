import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const steps = [
  'Personal Details',
  'Contact Details',
  'Address Details',
  'Identity Verification',
  'Security',
] as const

export const RegistrationStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({})

  const totalSteps = steps.length
  const completedSteps = Object.keys(completed).length
  const isLastStep = activeStep === totalSteps - 1
  const allStepsCompleted = completedSteps === totalSteps

  const handleNext = () => {
    const newActiveStep =
      isLastStep && !allStepsCompleted
        ? steps.findIndex((_step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    })
    handleNext()
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  const resetButtonRef = React.useRef<HTMLButtonElement>(null)
  const nextButtonRef = React.useRef<HTMLButtonElement>(null)
  const previousActiveStepRef = React.useRef(activeStep)
  const previousCompletedRef = React.useRef(completed)

  React.useEffect(() => {
    const previousCompleted = previousCompletedRef.current
    previousCompletedRef.current = completed

    if (allStepsCompleted) {
      resetButtonRef.current?.focus()
      return
    }

    if (
      Object.keys(completed).length === 0 &&
      Object.keys(previousCompleted).length !== 0
    ) {
      nextButtonRef.current?.focus()
    }
  }, [completed, allStepsCompleted])

  React.useEffect(() => {
    if (activeStep === 0 && previousActiveStepRef.current === 1) {
      nextButtonRef.current?.focus()
    }

    previousActiveStepRef.current = activeStep
  }, [activeStep])

  return (
    <Box sx={{ width: '100%', maxWidth: 960, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Account registration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete each step to open your account. You can jump between steps at any
        time.
      </Typography>

      <Stepper nonLinear alternativeLabel activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton
              aria-controls="stepper-content"
              color="inherit"
              onClick={handleStep(index)}
            >
              {label}
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
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset} ref={resetButtonRef}>
                Reset
              </Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Paper variant="outlined" sx={{ mt: 3, p: 3, minHeight: 160 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {steps[activeStep]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {totalSteps}. Place your form for this
                step here.
              </Typography>
            </Paper>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }} ref={nextButtonRef}>
                Next
              </Button>
              {completed[activeStep] && (
                <Typography variant="caption" sx={{ display: 'inline-block', alignSelf: 'center' }}>
                  Step {activeStep + 1} already completed
                </Typography>
              )}
               {(isLastStep && <Button onClick={handleComplete}>
                  Finish
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  )
}
