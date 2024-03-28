import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Box,Modal, Typography } from '@mui/material';
import createJSONObject from './FinalJSON';
import OperationJSONObject from './OperationJSON';
import PgDetails from './Pgdetails';
import SchemaTableSelector from './SchemaTableSelector';

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
  const [destinationType, setDestinationType] = useState(''); // State to manage the destination type
  const [showDestinationOptions, setShowDestinationOptions] = useState(false); // State to manage the visibility of the destination options dropdown
  const [showDatabaseModal, setShowDatabaseModal] = useState(false); // State for showing the database details modal
  const [showSchemaSelector, setShowSchemaSelector] = useState(false); // State for SchemaTableSelector visibility
  const [dbConnectionDetails, setDbConnectionDetails] = useState(null); // State to store database connection details
  const [showFileStorageModal, setShowFileStorageModal] = useState(false); // State for showing the file storage options modal

  const [user,setUser]=useState('')
  const [host,setHost]=useState('')
  const [database,setDatabase]=useState('')
  const [pass,setPass]=useState('')
  const [port,setPort]=useState('')
  const [schema,setSchema]=useState('')
  const [table,setTable]=useState('')

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  React.useEffect(() => {
    console.log("destination type: " + destinationType);
}, [destinationType]);
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
      // alert('JSON is generated.');
      const op = OperationJSONObject(
        FileName1,
        FileName2,
        SelectionType1,
        SelectionType2,
        DatabaseDetails1,
        DatabaseDetails2,
        selectedColumnsSource1,
        selectedColumnsSource2,
        joinType,
        schema,
        table,
        destinationType,
        host,
        user,
        database,
        pass,
        port
      );
      const backendjson = createJSONObject(source_left, source_right, op);
      
        try {
          const response = await fetch('http://localhost:4000/json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendjson),
          });
      
          if (!response.ok) {
            // If the server responded with an error status, throw an error
            const errorText = await response.text(); // Assuming error text response
            throw new Error(errorText);
          }
      
          const responseData = await response.text(); // Assuming the successful response is text
          alert("Join performed successfully! Your result is available at your folder");
        } catch (error) {
          // Catch fetch errors and server response errors
          alert(`Error: ${error.message}`);
        }
    
    }else {
      alert('Please choose an equal number of columns from both sources to pair.');
    }
  };
  const handleDestinationTypeChange = (event) => {
    const destination = event.target.value;
    setDestinationType(destination);

    if (destination === "Database Storage") {
      setShowDatabaseModal(true); // Directly show database modal for database storage
    } else if (destination === "File Storage") {
      setShowFileStorageModal(true); // Show file storage options for file storage
    }

    setShowDestinationOptions(false); 
  };
  const handleFileStorageSelection = (fileType) => {
    setDestinationType(fileType); // Set the destination type to the selected file type
    setShowFileStorageModal(false); // Close the file storage options modal
  };

  // Style for the modals can remain the same as modalStyle
  // Define the file storage modal content
  const fileStorageModalContent = (
    <Box sx={modalStyle}>
      <Typography id="file-storage-modal-title" variant="h6" component="h2">
        Select File Storage Type
      </Typography>
      {/* List of file storage options */}
      {['CSV Storage', 'JSON Storage', 'XML Storage', 'Parquet Storage'].map((storageType) => (
        <Button
          key={storageType}
          variant="contained"
          sx={{ mt: 2, mb: 1, width: '100%' }}
          onClick={() => handleFileStorageSelection(storageType)}
        >
          {storageType}
        </Button>
      ))}
    </Box>
  );
  // Toggle the visibility of the destination options dropdown
  const toggleDestinationOptions = () => {
    setShowDestinationOptions(!showDestinationOptions);
  };
  

  const handleDatabaseDetailsClose = (data, connectionDetails) => {
    // Handle the database connection details here
    setDbConnectionDetails(connectionDetails);
    setUser(connectionDetails.user)
    setHost(connectionDetails.host)
    setDatabase(connectionDetails.database)
    setPort(connectionDetails.port)
    setPass(connectionDetails.password)
    setShowDatabaseModal(false); // Close the modal
    setShowSchemaSelector(true); // Open the SchemaTableSelector
    // You may want to store the database connection details in a state or proceed with further operations
  };
  const handleSchemaTableSelectionComplete = (selectedSchema, selectedTable) => {
    // Handle the selected schema and table here
   setSchema(selectedSchema)
   setTable(selectedTable)
    
    // You can set these values to state variables or perform further actions as needed
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
        <>
          <Button
            variant="contained"
            onClick={toggleDestinationOptions}
            sx={{
              alignSelf: 'center',
              backgroundColor: '#4caf50', // A distinctive green color
              color: 'white',
              ':hover': {
                backgroundColor: '#388e3c', // Darker shade on hover
              },
              width: 'calc(50% + 16px)', // Slightly wider than the "Proceed" button
              mb: 1, // Margin bottom for spacing
            }}
          >
            {destinationType ? destinationType : 'Set Destination'}
          </Button>
          {showDestinationOptions && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="destination-type-select-label">Destination Type</InputLabel>
              <Select
                labelId="destination-type-select-label"
                id="destination-type-select"
                value={destinationType}
                label="Destination Type"
                onChange={handleDestinationTypeChange}
              >
                <MenuItem value="File Storage">File Storage</MenuItem>
                <MenuItem value="Database Storage">Database Storage</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            onClick={handleCompare}
            variant="contained"
            sx={{ alignSelf: 'center' }}
          >
            Proceed
          </Button>
        </>
      )}
      <Modal
        open={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter Database Details
          </Typography>
          <PgDetails onCredentialsSubmit={handleDatabaseDetailsClose} />
        </Box>
      </Modal>
      {/* Conditionally render the SchemaTableSelector */}
      {showSchemaSelector && dbConnectionDetails && (
        <SchemaTableSelector connectionDetails={dbConnectionDetails} onClose={() => setShowSchemaSelector(false)} onSelectionComplete={handleSchemaTableSelectionComplete} />
      )}
       <Modal
        open={showFileStorageModal}
        onClose={() => setShowFileStorageModal(false)}
        aria-labelledby="file-storage-modal-title"
        aria-describedby="file-storage-modal-description"
      >
        {fileStorageModalContent}
      </Modal>
    </Box>
  );
}

export default JoinOperationSelect;
