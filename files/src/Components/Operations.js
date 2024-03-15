import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Box } from '@mui/material';

function JoinOperationSelect() {
  const [joinType, setJoinType] = useState('');

  const handleChange = (event) => {
    setJoinType(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <FormControl fullWidth sx={{ mb: 2 }}> {/* Add some margin-bottom for spacing */}
        <InputLabel id="join-operation-select-label">Join Operation</InputLabel>
        <Select
          labelId="join-operation-select-label"
          id="join-operation-select"
          value={joinType}
          label="Join Operation"
          onChange={handleChange}
        >
          <MenuItem value="equijoin">Equijoin</MenuItem>
          <MenuItem value="left-join">Left Join</MenuItem>
          <MenuItem value="right-join">Right Join</MenuItem>
        </Select>
      </FormControl>
      {/* Conditionally render the submit button if joinType is not empty */}
      {joinType && (
        <Button
          variant="contained"
          sx={{ alignSelf: 'center' }} // Center the button (useful if not using a wrapping Box)
        >
          Submit
        </Button>
      )}
    </Box>
  );
}

export default JoinOperationSelect;
