import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import Dbcomp1 from './Dbcomp1'; // Ensure this path matches your file structure
import ColumnsDisplay from './ColumnsDropdown';
import Papa from 'papaparse';
import styles from './BasicExample.module.css';
import { parse, isValid } from 'date-fns';

function BasicExample(props) {
  const [selectionType, setSelectionType] = useState(''); // Track what is selected ('file' or 'database')
  const [fileName, setFileName] = useState(''); // Track selected file's name
  // Updated to track database, schema, and table names
  const [databaseDetails, setDatabaseDetails] = useState({
    databaseName: '',
    schemaName: '',
    tableName: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDbDialogOpen, setIsDbDialogOpen] = useState(false);
  const fileInput = useRef(null);
  const [csvHeaders, setCsvHeaders] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectionType('file');
      parseCsvHeaders(file);
    }
  };

  const parseCsvHeaders = (file) => {
  Papa.parse(file, {
    complete: (results) => {
      const headers = results.data[0]; // Assuming the first row contains headers
      const dataTypes = headers.map((header, index) => inferColumnType(results.data.slice(1), index));
      setCsvHeaders(headers.map((header, index) => ({ name: header, type: dataTypes[index] }))); // Update state with headers and inferred types
      console.log(setCsvHeaders);
    },
  });
};



const inferColumnType = (data, columnIndex) => {
  let numericCount = 0;
  let dateCount = 0;
  let stringCount = 0;

  // Limit the loop to the first 10 rows or the total number of rows, whichever is smaller
  const rowsToCheck = Math.min(data.length, 10);

  for (let rowIndex = 0; rowIndex < rowsToCheck; rowIndex++) {
    const row = data[rowIndex];
    if (row.length <= columnIndex) continue; // Skip if the column doesn't exist in this row

    const value = row[columnIndex];
    if (value === undefined || value === null || value.trim() === '') {
      continue; // Skip empty values
    }

    let processedValue = value.trim();
    // Specifically check for prices (values starting with '$')
    if (processedValue.startsWith('$')) {
      processedValue = processedValue.replace(/[$,]+/g, ''); // Remove $ and commas
      const numericValue = parseFloat(processedValue);
      if (!isNaN(numericValue)) {
        numericCount++;
        continue; // Move to the next iteration as we've classified this as numeric
      }
    }

    // Attempt to parse as a date
    const date = new Date(value);
    const isDateValid = !isNaN(date.getTime()) && /[-\/]/.test(value);
    if (isDateValid) {
      dateCount++;
      continue;
    }

    // If it's neither clearly numeric nor a valid date, consider it a string
    const numericValue = parseFloat(processedValue.replace(/,/g, '')); // Also consider general numeric values without $
    if (!isNaN(numericValue) && numericValue.toString() === processedValue.replace(/,/g, '')) {
      numericCount++;
    } else {
      stringCount++;
    }
  }

  // Decision logic to determine the predominant data type in the column
  if (dateCount > numericCount && dateCount > stringCount) {
    return 'Date';
  } else if (numericCount > dateCount && numericCount > stringCount) {
    return 'Number';
  } else {
    return 'String';
  }
};




  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickFileInput = () => {
    fileInput.current.click();
    handleClose();
    setDatabaseDetails({
      databaseName: '',
      schemaName: '',
      tableName: '',
    });
    setCsvHeaders([]); // Ensure this is called to clear previous state
  };

  const handleOpenDbDialog = () => {
    setIsDbDialogOpen(true);
    setSelectionType('database');
    handleClose();
    setCsvHeaders([]); // Clear CSV headers when switching to database
  };

  const handleSelections = (dbname, schema, table, columns = []) => {
    setDatabaseDetails({
      databaseName: dbname,
      schemaName: schema,
      tableName: table,
    });
    setCsvHeaders(columns); // Update headers for database columns
  };

  const selectionMessage = () => {
    if (selectionType === 'file') {
      return `Selected File: ${fileName}`;
    } else if (selectionType === 'database') {
      return `DB- ${databaseDetails.databaseName}, Schema - ${databaseDetails.schemaName}, Table - ${databaseDetails.tableName}`;
    } else {
      return 'No selection';
    }
  };

  return (
    <div className={styles.container}>
      <Button
  aria-controls="basic-menu"
  aria-haspopup="true"
  onClick={handleClick}
  style={{
    backgroundColor: '#56d75a', // Green
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderColor: 'primary.main',
    borderWidth: '1px',
    borderStyle: 'solid',
    // Note: ':hover' pseudo-class cannot be used within inline styles
  }}
>
  {props.name}
</Button>

      <Menu id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClickFileInput}>File</MenuItem>
        <MenuItem onClick={handleOpenDbDialog}>Database</MenuItem>
        {/* <MenuItem onClick={handleClose}>App</MenuItem> */}
      </Menu>
      <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: 'none' }} />
      <p className={styles.selectionMessage}>{selectionMessage()}</p>
      <Dbcomp1
        isDbDialogOpen={isDbDialogOpen}
        setOpenDbDialog={setIsDbDialogOpen}
        onSelections={handleSelections}
      />
      {/* Conditional rendering based on selectionType */}
      {selectionType && csvHeaders.length > 0 && <ColumnsDisplay columns={csvHeaders} label={props.name} />}
    </div>
  );
}

export default BasicExample;
