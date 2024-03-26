import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Box } from '@mui/material';
import createJSONObject from './FinalJSON';
import OperationJSONObject from './OperationJSON';

/**
 * Component for selecting and performing join operations.
 * Allows the user to select a join operation type and trigger the comparison.
 *
 * @param {Object} props - Component props.
 * @param {string} props.source_left - The left source for the comparison.
 * @param {string} props.source_right - The right source for the comparison.
 * @param {string} props.FileName1 - The name of the first file or table.
 * @param {string} props.FileName2 - The name of the second file or table.
 * @param {string} props.SelectionType1 - The selection type for the first source (file or database).
 * @param {string} props.SelectionType2 - The selection type for the second source (file or database).
 * @param {Object} props.DatabaseDetails1 - Details of the database for the first source.
 * @param {Object} props.DatabaseDetails2 - Details of the database for the second source.
 * @param {Array} props.selectedColumnsSource1 - Selected columns from the first source.
 * @param {Array} props.selectedColumnsSource2 - Selected columns from the second source.
 * @returns {React.Component} A React component for selecting join operations.
 */
function JoinOperationSelect({
  source_left,
  source_right,
  FileName1,
  FileName2,
  SelectionType1,
  SelectionType2,
  DatabaseDetails1,
  DatabaseDetails2,
  selectedColumnsSource1,
  selectedColumnsSource2
}) {
  const [joinType, setJoinType] = useState('');

  /**
   * Handles the change event of the select input.
   *
   * @param {Object} event - The event object.
   */
  const handleChange = (event) => {
    setJoinType(event.target.value);
  };

  /**
   * Handles the comparison and triggers the backend API call.
   */
  const handleCompare = async () => {
    if (selectedColumnsSource1.length === 0 && selectedColumnsSource2.length === 0) {
      alert('Please select columns from both sources.');
    } else if (selectedColumnsSource1.length === selectedColumnsSource2.length) {
      alert('JSON is generated.');
      const op = OperationJSONObject(
        FileName1,
        FileName2,
        SelectionType1,
        SelectionType2,
        DatabaseDetails1,
        DatabaseDetails2,
        selectedColumnsSource1,
        selectedColumnsSource2,
        joinType
      );
      const backendjson = createJSONObject(source_left, source_right, op);
      console.log(backendjson);
      const response = await fetch('http://localhost:4000/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendjson),
      });
      // const data = await response.json();
    } else {
      alert('Please choose an equal number of columns from both sources to pair.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="join-operation-select-label">Join Operation</InputLabel>
        <Select
          labelId="join-operation-select-label"
          id="join-operation-select"
          value={joinType}
          label="Join Operation"
          onChange={handleChange}
        >
          <MenuItem value="inner">Inner Join</MenuItem>
          <MenuItem value="left">Left Join</MenuItem>
          <MenuItem value="right">Right Join</MenuItem>
          <MenuItem value="outer">Outer Join</MenuItem>
        </Select>
      </FormControl>
      {joinType && (
        <Button
          onClick={handleCompare}
          variant="contained"
          sx={{ alignSelf: 'center' }}
        >
          Proceed
        </Button>
      )}
    </Box>
  );
}

export default JoinOperationSelect;
