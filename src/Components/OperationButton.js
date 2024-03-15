import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, MenuItem } from '@mui/material';
import './OperationButton.css'

const OperationButton = ({ selectedOperation, setSelectedOperation, operations, handleOperationChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog visibility

  const handleButtonClick = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  return (
    <div className='operation-button'>
      <Button className="operation-component-button" variant="outlined" onClick={handleButtonClick}>
        {selectedOperation || 'OPERATION'}
      </Button>
      {/* Dialog box */}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Select Operation</DialogTitle>
        <DialogContent className='operation-selection'>
        {operations.map((operation, index) => (
            <MenuItem key={index} onClick={() => {
              setSelectedOperation(operation); // Set the selected operation
              handleClose(); // Close the dialog after selecting an operation
            }}>
              {operation}
            </MenuItem>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperationButton;
