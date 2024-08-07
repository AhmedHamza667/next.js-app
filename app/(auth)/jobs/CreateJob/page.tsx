'use client';
import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Stepper, Step, StepLabel, Box } from '@mui/material';
import { styled } from '@mui/system';
import CreateJobNavBar from '@/app/(conponants)/CreateJobNavBar';
import StepOne from './(steps)/StepOne';
import StepTwo from './(steps)/StepTwo';
// import StepThree from '.(steps)/StepThree';
// import StepFour from './(steps)/StepFour';

const FormContainer = styled(Paper)({
  padding: '2rem',
  marginTop: '2rem',
  borderRadius: '0.5rem',
});

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

const CreateJob = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = (formData) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use the formData state to construct your GraphQL query
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepOne handleNext={handleNext} />;
      case 1:
        return <StepTwo handleNext={handleNext} />;
      // case 2:
      //   return <StepThree formData={formData} setFormData={setFormData} />;
      // case 3:
      //   return <StepFour formData={formData} setFormData={setFormData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <CreateJobNavBar />
      <Container sx={{ width: '50%', padding: 4 }}>
        <FormContainer elevation={3}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel={false}
          
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  sx={{
                    '& .MuiStepIcon-root': {
                      width: '40px',  // Adjust the size as needed
                      height: '40px',
                      backgroundColor: 'white',
                      border: '1px solid #0D1A3B', // Rounded border for inactive steps
                      borderRadius: '50%', // Make the border rounded
                        
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                      color: '#0D1A3B', // Active step color
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                      color: '#0D1A3B', // Completed step color
                    },
                    '& .MuiStepLabel-labelContainer': {
                      display: 'none', // Hide the label
                    },
                  }}
                >
                  {''}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
            {getStepContent(activeStep)}
        </FormContainer>
      </Container>
    </>
  );
};

export default CreateJob;
