// ParentComponent.js

import React, { useState } from 'react';
import { MenuItem, FormControl, InputLabel, Select, Button } from '@mui/material';
import FileDialog from './FileDialog'; // Import FileDialog component

const ParentComponent = ({ mergedData }) => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
  const [openFileDialog, setOpenFileDialog] = useState(false); // State to control dialog visibility

  const handleFileSelection = (event) => {
    setSelectedFile(event.target.files[0]); // Set selected file
    setOpenFileDialog(true); // Open the file dialog
  };

  const handleCloseFileDialog = () => {
    setOpenFileDialog(false); // Close the file dialog
  };

  return (
    <div>
      {/* Select component */}
      <FormControl style={{ minWidth: '200px' }}>
        <InputLabel id="file-selection-label">Select File</InputLabel>
        <Select
          labelId="file-selection-label"
          value={selectedFile ? selectedFile.name : ''}
          label="Select File"
          onChange={handleFileSelection}
          style={{ minWidth: '200px' }}
        >
          {/* Render menu items */}
          {/* Option to select a file */}
          <MenuItem value="">
            <em>Select a File</em>
          </MenuItem>
          {/* Render the file names */}
          <MenuItem value={selectedFile ? selectedFile.name : ''}>{selectedFile ? selectedFile.name : 'No file selected'}</MenuItem>
        </Select>
      </FormControl>

      {/* Render the file dialog */}
      <FileDialog open={openFileDialog} onClose={handleCloseFileDialog} selectedFile={selectedFile} />

      {/* Button to view merged data */}
      <Button variant="outlined" onClick={() => console.log(mergedData)}>View Merged Data</Button>
    </div>
  );
};

export default ParentComponent;
