import React, { useState } from 'react';
import Button from '@mui/material/Button'; // Import Button from MUI
import Box from '@mui/material/Box';
import Dropdown from './Dropdown'; // Ensure this is your converted Material-UI Dropdown
import Operation from './Operations';
import MultipleSelect from './MultipleSelect';
import SourceJSONObject from './SourceJSON';

/**
 * Component for managing source selections and operations.
 * Allows the user to select and confirm data sources and perform operations on them.
 *
 * @returns {React.Component} A React component for managing source selections and operations.
 */
export default function SourceComponent() {
  const [databaseDetails1, setDatabaseDetails1] = useState({
    databaseName: '',
    schemaName: '',
    tableName: '',
  });
  const [databaseDetails2, setDatabaseDetails2] = useState({
    databaseName: '',
    schemaName: '',
    tableName: '',
  });

  const [fileName1, setFileName1] = useState('');
  const [fileName2, setFileName2] = useState('');
  const [selectionType1, setSelectionType1] = useState('');
  const [selectionType2, setSelectionType2] = useState('');
  const [connectionDetails1, setConnectionDetails1] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });
  const [connectionDetails2, setConnectionDetails2] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });
  const [source1Columns, setSource1Columns] = useState([]);
  const [source2Columns, setSource2Columns] = useState([]);
  const [sourcesConfirmed, setSourcesConfirmed] = useState(false); // State to track if sources are confirmed
  const [selectedColumnsSource1, setSelectedColumnsSource1] = React.useState([]);
  const [selectedColumnsSource2, setSelectedColumnsSource2] = React.useState([]);
  const [LeftSourceJSON, setLeftSourceJSON] = useState('');
  const [RightSourceJSON, setRightSourceJSON] = useState('');

  // Function to handle selections made by the user
  const handleSelections = (selected, sourceLabel) => {
    if (sourceLabel === 'Source 1') {
      setSelectedColumnsSource1(selected);
    } else if (sourceLabel === 'Source 2') {
      setSelectedColumnsSource2(selected);
    }
  };

  const handleSource1Columns = (columns) => {
    setSource1Columns(columns);
  };

  const handleSource2Columns = (columns) => {
    setSource2Columns(columns);
  };

  const handleConfirmSources = () => {
    setSourcesConfirmed(true); // Update state to indicate sources are confirmed
  };

  
  const handleDropdownSelection1 = (type, name, details, conndetails) => {
    setSelectionType1(type);
    setFileName1(name);
    setDatabaseDetails1(details);
    setConnectionDetails1(conndetails);// Pass connectionDetails to SourceComponent
    setLeftSourceJSON(SourceJSONObject(details,name,type,conndetails))
    
  };
  const handleDropdownSelection2 = (type, name, details, conndetails) => {
    setSelectionType2(type);
    setFileName2(name);
    setDatabaseDetails2(details);
    setConnectionDetails2(conndetails);// Pass connectionDetails to SourceComponent
    setRightSourceJSON(SourceJSONObject(details,name,type,conndetails))
  };
  React.useEffect(() => {
    console.log("Source name 1: " + fileName1);
}, [fileName1]);

React.useEffect(() => {
    console.log("Source name 2: " + fileName2);
}, [fileName2]);

React.useEffect(() => {
  console.log("db name 1: " + databaseDetails1.databaseName);
}, [databaseDetails1]);

React.useEffect(() => {
  console.log("db name 2: " + databaseDetails2[0]);
}, [databaseDetails2]);

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', my: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Dropdown name="Source 1" onColumnsSelected={handleSource1Columns} onSelectChange={handleDropdownSelection1} />
        <Dropdown name="Source 2" onColumnsSelected={handleSource2Columns} onSelectChange={handleDropdownSelection2} />
      </Box>
      {/* Button appears if both sources are selected but not yet confirmed */}
      {/* {(source1Columns.length > 0 && source2Columns.length > 0 && !sourcesConfirmed) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Button variant="contained" onClick={handleConfirmSources}>
            Confirm Sources
          </Button>
        </Box>
      )} */}
      {/* ColumnsDisplay component is rendered only after sources are confirmed */}
      {(source1Columns.length > 0 && source2Columns.length > 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
          <MultipleSelect 
            columns={source1Columns} 
            label="Source 1" 
            selected={selectedColumnsSource1} 
            onSelections={handleSelections}
            resetTrigger={fileName1+databaseDetails1.databaseName+databaseDetails1.schemaName+databaseDetails1.tableName}
          />
         
          <MultipleSelect 
            columns={source2Columns} 
            label="Source 2" 
            selected={selectedColumnsSource2} 
            onSelections={handleSelections}
             resetTrigger={fileName2+databaseDetails2.databaseName+databaseDetails2.schemaName+databaseDetails2.tableName}
          />
        </Box>
      )}
      <Operation 
        selectedColumnsSource1={selectedColumnsSource1} 
        selectedColumnsSource2={selectedColumnsSource2}
        source_left={LeftSourceJSON}
        source_right={RightSourceJSON}
        FileName1={fileName1}
        FileName2={fileName2}
        SelectionType1={selectionType1}
        SelectionType2={selectionType2}
        DatabaseDetails1={databaseDetails1}
        DatabaseDetails2={databaseDetails2}
      />
    </Box>
  );
}
