import React, { useState, useRef,useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import Dbcomp1 from './Dbcomp1'; // Ensure this path matches your file structure
import Papa from 'papaparse';
import styles from './BasicExample.module.css';


function BasicExample({ onColumnsSelected, name, onSelectChange }) {
  const [connectionDetails, setConnectionDetails] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });
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
  const [Headers, setHeaders] = useState([]);
  const [source1Selections, setSource1Selections] = useState([]);
const [source2Selections, setSource2Selections] = useState([]);
const [isSource1Confirmed, setIsSource1Confirmed] = useState(false);
const [isSource2Confirmed, setIsSource2Confirmed] = useState(false);

const handleSelectionChange = (sourceName, selections) => {
  if (sourceName === 'Source 1') {
    setSource1Selections(selections);
  } else if (sourceName === 'Source 2') {
    setSource2Selections(selections);
  }
  console.log(`${sourceName} Selections: `, selections);
  // console.log("comment"+source1Selections);
};

/**
 * Handle the change event when a file is selected.
 * @param {Event} event - The change event object.
 */
const handleFileChange = (event) => {
  try {
    const file = event.target.files[0];
    console.log(file.type);
    if (file.type === 'text/csv') {
      setFileName(file.name);
      setSelectionType('csv');
      parseCsvHeaders(file);
    } else if (file.type === 'text/xml') {
      setFileName(file.name);
      setSelectionType('xml');
      parseXmlHeaders(file);
    } else if (file.type === 'application/json') {
      setFileName(file.name);
      setSelectionType('json');
      readJsonHeaders(file);
    } else {
      throw new Error('Unsupported file type. Only CSV, XML, and JSON files are supported.');
    }
  } catch (error) {
    console.error('Error handling file change:', error);
    // Handle the error appropriately, e.g., display a message to the user
  }
};


  /**
 * Parse the headers and infer data types from a CSV file.
 * @param {File} file - The CSV file to parse.
 * @throws {Error} Throws an error if there is an issue parsing the CSV file.
 */
const parseCsvHeaders = (file) => {
  Papa.parse(file, {
    complete: (results) => {
      try {
        const headers = results.data[0]; // Assuming the first row contains headers
        const dataTypes = headers.map((header, index) => inferColumnType(results.data.slice(1), index));
        setHeaders(headers.map((header, index) => ({ name: header, type: dataTypes[index] }))); // Update state with headers and inferred types
      } catch (error) {
        alert('Error parsing CSV headers:', error);
        throw new Error('Failed to parse CSV headers.');
      }
    },
    error: (error) => {
      alert('Error parsing CSV:', error);
      throw new Error('Failed to parse CSV file.');
    }
  });
};


/**
 * Parse the headers from an XML file.
 * @param {File} file - The XML file to parse.
 * @throws {Error} Throws an error if there is an issue parsing the XML file.
 */
const parseXmlHeaders = (file) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const xmlString = event.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      const headers = [];
      const dataTypeMap = new Map();

      // Assuming the first child of the root element contains headers
      const firstRow = xmlDoc.documentElement.firstElementChild;
      if (firstRow) {
        // Extract headers
        firstRow.childNodes.forEach((node) => {
          if (node.nodeName !== '#text') {
            const headerName = node.nodeName;
            headers.push(headerName);

            // For simplicity, you can set the data type of each header to 'String' initially
            dataTypeMap.set(headerName, 'String');
          }
        });
      }

      const headersWithTypes = headers.map((header) => ({ name: header, type: dataTypeMap.get(header) }));
      setHeaders(headersWithTypes);
      // console.log(headersWithTypes);
    } catch (error) {
      console.error('Error parsing XML headers:', error);
      throw new Error('Failed to parse XML headers.');
    }
  };

  reader.readAsText(file);
};


/**
 * Read and parse the headers from a JSON file.
 * @param {File} file - The JSON file to read and parse.
 * @throws {Error} Throws an error if there is an issue parsing the JSON file.
 */
const readJsonHeaders = (file) => {
  const reader = new FileReader();
  const dataTypeMap = new Map();

  reader.onload = (event) => {
    try {
      const jsonString = event.target.result;
      const jsonData = JSON.parse(jsonString);
      
      if (Array.isArray(jsonData)) {
        // Extract headers and infer data types
        const headers = Object.keys(jsonData[0]);
        headers.forEach((header) => {
          const dataType = inferDataType(jsonData[0][header]);
          dataTypeMap.set(header, dataType);
        });
        const headersWithTypes = headers.map((header) => ({ name: header, type: dataTypeMap.get(header) }));
        setHeaders(headersWithTypes);
      } else if (typeof jsonData === 'object') {
        // Extract headers and infer data types
        const headers = Object.keys(jsonData);
        headers.forEach((header) => {
          const dataType = inferDataType(jsonData[header]);
          dataTypeMap.set(header, dataType);
        });
        const headersWithTypes = headers.map((header) => ({ name: header, type: dataTypeMap.get(header) }));
        setHeaders(headersWithTypes);
        console.log(headersWithTypes);
      } else {
        throw new Error('Invalid JSON format: The JSON data must be an array or an object.');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Failed to parse JSON headers.');
    }
  };

  reader.readAsText(file);
};

/**
 * Infers the data type of a given value.
 * @param {*} value - The value to infer the data type for.
 * @returns {string} The inferred data type ('Number', 'Boolean', 'Date', or 'String').
 */
const inferDataType = (value) => {
  try {
    if (typeof value === 'number') {
      return 'Number';
    } else if (typeof value === 'boolean') {
      return 'Boolean';
    } else if (value instanceof Date && !isNaN(value)) {
      return 'Date';
    } else {
      return 'String';
    }
  } catch (error) {
    console.error('Error in inferDataType:', error);
    return 'Unknown'; // Return a default value in case of any error
  }
};


/**
 * Infers the column data type based on the provided data.
 * @param {Array<Array<any>>} data - The data to analyze.
 * @param {number} columnIndex - The index of the column to infer the type for.
 * @returns {string} The inferred data type ('Number', 'Date', or 'String').
 */
const inferColumnType = (data, columnIndex) => {
  try {
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
  } catch (error) {
    console.error('Error in inferColumnType:', error);
    return 'Unknown'; // Return a default value in case of any error
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
    setHeaders([]); // Ensure this is called to clear previous state
  };

  const handleOpenDbDialog = () => {
    setIsDbDialogOpen(true);
    setSelectionType('database');
    handleClose();
    setHeaders([]); // Clear CSV headers when switching to database
  };

  const handleSelections = (dbname, schema, table, columns = []) => {
    setDatabaseDetails({
      databaseName: dbname,
      schemaName: schema,
      tableName: table,
    });
    setHeaders(columns);
     // Update headers for database columns
  };

  const handleConnectionDetails = (connectionDetails) => {
    setConnectionDetails(connectionDetails); // Update connectionDetails state in BasicExample
  };

/**
 * Constructs a message based on the selected file or database details.
 * @returns {string} The constructed message indicating the selected file or database details.
 */
const selectionMessage = () => {
  try {
      if (selectionType === 'csv' || selectionType === 'xml' || selectionType === 'json') {
          return `Selected File: ${fileName}`;
      } else if (selectionType === 'database') {
          return `DB- ${databaseDetails.databaseName}, Schema - ${databaseDetails.schemaName}, Table - ${databaseDetails.tableName}`;
      } else {
          return 'No selection';
      }
  } catch (error) {
      console.error('Error in selectionMessage:', error);
      return 'Error: Unable to determine selection';
  }
};





  useEffect(() => {
    if (Headers.length > 0) {
      onColumnsSelected(Headers);
    }
  }, [Headers, onColumnsSelected]);

  useEffect(() => {
    // Pass props to the parent component (SourceComponent) using callback functions
    onSelectChange(selectionType, fileName, databaseDetails, connectionDetails);
  }, [selectionType, fileName, databaseDetails, connectionDetails, onSelectChange]);


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
  {name}
</Button>

      <Menu id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClickFileInput}>File</MenuItem>
        <MenuItem onClick={handleOpenDbDialog}>Database</MenuItem>
      </Menu>
      <input className={styles.SourceDropdown} type="file" ref={fileInput} onChange={handleFileChange}/>
      <p className={styles.selectionMessage}>{selectionMessage()}</p>
      <Dbcomp1
          isDbDialogOpen={isDbDialogOpen}
          setOpenDbDialog={setIsDbDialogOpen}
          onSelections={handleSelections}
          onConnectionDetails={handleConnectionDetails} // Pass connectionDetails here
          selectionsAreEqual={source1Selections.length === source2Selections.length} 
        />
    </div>
  );
}

export default BasicExample;
