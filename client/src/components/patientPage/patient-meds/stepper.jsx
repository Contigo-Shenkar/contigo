import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["Add Review", "Alternative medications", "Finish"];

export default function HorizontalLinearStepper({ activeStep = 0 }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step
              key={label}
              completed={activeStep > index}
              active={activeStep === index}
              disabled={activeStep < index}
              sx={
                activeStep === index
                  ? {
                      bgcolor: "lightblue",
                      borderRadius: "10px",
                      padding: "10px",
                    }
                  : {}
              }
            >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
