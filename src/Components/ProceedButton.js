import React from 'react';
import { Button } from '@mui/material';
import CaptureInput from './CaptureInput'; // Assuming the file containing captureUserInput function is named captureUserInput.js

const CaptureButton = ({ sources, selectedOperation }) => {
  const handleClick = () => {
    const capturedData = CaptureInput(sources, selectedOperation);
    console.log('Captured Data:', capturedData); // You can replace console.log with any logic to handle the captured data
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      Proceed
    </Button>
  );
};

export default CaptureButton;
