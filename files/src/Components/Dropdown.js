import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import Dbcomp1 from './Dbcomp1'; // Ensure this path matches your file structure
import ColumnsDisplay from './ColumnsDropdown';
import Papa from 'papaparse';
import styles from './BasicExample.module.css';

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
        setCsvHeaders(headers); // Update state with CSV headers
      },
      preview: 1, // Only parse the first row to get headers
    });
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
        className={styles.button}
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          borderColor: 'primary.main',
          borderWidth: '1px',
          borderStyle: 'solid',
          '&:hover': {
            backgroundColor: 'primary.light',
            borderColor: 'primary.dark',
          },
          color: 'primary.main',
        }}
      >
        {props.name}
      </Button>

      <Menu id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClickFileInput}>File</MenuItem>
        <MenuItem onClick={handleOpenDbDialog}>Database</MenuItem>
        <MenuItem onClick={handleClose}>App</MenuItem>
      </Menu>
      <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: 'none' }} />
      <p className={styles.selectionMessage}>{selectionMessage()}</p>
      <Dbcomp1
        isDbDialogOpen={isDbDialogOpen}
        setOpenDbDialog={setIsDbDialogOpen}
        onSelections={handleSelections}
      />
      {/* Conditional rendering based on selectionType */}
      {selectionType && csvHeaders.length > 0 && <ColumnsDisplay columns={csvHeaders} />}
    </div>
  );
}

export default BasicExample;
