import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Box } from '@mui/material';
import createJSONObject from './FinalJSON';
import OperationJSONObject from './OperationJSON';

function JoinOperationSelect({ source_left,source_right,FileName1,FileName2,SelectionType1,SelectionType2, DatabaseDetails1,DatabaseDetails2,selectedColumnsSource1, selectedColumnsSource2 }) {
  const [joinType, setJoinType] = useState('');

  const handleChange = (event) => {
    setJoinType(event.target.value);
  };

  const handleCompare = () => {
    console.log(selectedColumnsSource1);
    console.log(selectedColumnsSource2);
    if (selectedColumnsSource1.length===0 && selectedColumnsSource2.length===0) {
        alert('Please Select columns from both sources');
    } else if(selectedColumnsSource1.length === selectedColumnsSource2.length){
      const op=OperationJSONObject(FileName1,FileName2,SelectionType1,SelectionType2,DatabaseDetails1,DatabaseDetails2,selectedColumnsSource1,selectedColumnsSource2,joinType)
      const backendjson=createJSONObject(source_left,source_right,op)
      console.log(backendjson)
      alert("JSON is generated");
    }
    else {
      alert('Length is not same');
    }


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
        onClick={handleCompare} // Center the button (useful if not using a wrapping Box)
        >
          Proceed
          
        </Button>
      )}
    </Box>
  );
}

export default JoinOperationSelect;