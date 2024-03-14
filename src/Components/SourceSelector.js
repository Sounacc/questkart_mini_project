// SourceSelection.js

// SourceSelection.js

// SourceSelection.js

import React from 'react';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import './SourceSelector.css'; // Import the CSS file

const SourceSelection = ({ value, onChange, label, fileLocation }) => {
  return (
    <div className="source-selection-container">
      <FormControl className="source-selection-form-control">
        <InputLabel id="source-selection-label">{`Source ${label}`}</InputLabel>
        <Select
          className="source-selection-select"
          labelId="source-selection-label"
          id={`source-selection-${label}`}
          value={value}
          label={`Source ${label}`}
          onChange={onChange}
        >
          <MenuItem value="file">{fileLocation ? fileLocation : `File ${label}`}</MenuItem>
          <MenuItem value="database">Database {label}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SourceSelection;
