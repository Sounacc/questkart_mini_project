import React, {useEffect, useState } from 'react';
import { Button, Menu, MenuItem, Dialog, Select, FormControl, InputLabel, DialogContent } from '@mui/material';
import PgDetails from './Pgdetails'; // Import your PgDetails component
import Operation from './Operations'

/**
 * Component for database operations.
 * Allows the user to select a database, schema, and table, and perform operations on it.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setOpenDbDialog - Function to set the open state of the database dialog.
 * @param {boolean} props.isDbDialogOpen - Boolean state indicating if the database dialog is open.
 * @param {Function} props.onSelections - Function to handle selections made by the user.
 * @returns {React.Component} A React component for database operations.
 */


function Dbcomp1({ setOpenDbDialog, isDbDialogOpen,onSelections, onConnectionDetails  }) {
  const [connectionDetails, setConnectionDetails] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });
  const [currentStep, setCurrentStep] = useState('dbChoice'); // New state to track dialog steps
  const [schemas, setSchemas] = useState([]);
  const [selectedDb, setSelectedDb] = useState(''); // New state for selected database
  const [selectedSchema, setSelectedSchema] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState([]);
  const [operationSelected, setOperationSelected] = useState(false);
  const [condition,setCondition]=useState(0);


  // Reset state when dialog is closed
  useEffect(() => {
    if (!isDbDialogOpen) {
      resetState();
    }
  }, [isDbDialogOpen]);

  /**
   * Resets the component state to its initial values.
   */

  const resetState = () => {
    setCurrentStep('dbChoice');
    setSchemas([]);
    setSelectedDb('');
    setSelectedSchema('');
    setTables([]);
    setSelectedTable('');
    setColumns([]);
    setOperationSelected(false);
  };

  /**
   * Handles the submission of database credentials and moves to schema selection step.
   *
   * @param {Array} schemas - Array of schemas fetched based on credentials.
   */
  
  const handleCredentialsSubmit = (schemas, connectionDetails) => {
    setSchemas(schemas);
    setCurrentStep('schemaSelection');
    setConnectionDetails(connectionDetails);
    onConnectionDetails(connectionDetails); // Pass connectionDetails to the parent component
    console.log(connectionDetails);
  };
  

  const handleDbChoice = (db) => {
    if (db !== selectedDb) {
      resetState(); // Reset state if a different database is chosen
    }
    setSelectedDb(db);
    setCurrentStep('credentials'); // Move to credentials step
  };

  const handleSchemaChange = async (event) => {
    const schema = event.target.value;
    setSelectedSchema(schema);
    // Fetch tables for the selected schema
    try {
      const response = await fetch('http://localhost:4000/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema }),
      });
      const tablesData = await response.json();
      setTables(tablesData);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleTableChange = async (event) => {
    const table = event.target.value;
    setSelectedTable(table);
    onSelections(selectedDb,selectedSchema, table); 
    
    // Fetch columns for the selected table
    try {
      const response = await fetch('http://localhost:4000/columns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema: selectedSchema, table }),
      });
     
      const columnsData = await response.json();
      const formattedColumnsData = columnsData.map(col => ({
        name: col.column_name, // Adjust based on your actual data structure
        type: col.data_type // Adjust based on your actual data structure
      }));
      setColumns(formattedColumnsData); // Store the formatted columns in the state

      // Call onSelections with the database, schema, table, and formatted columns
      onSelections(selectedDb, selectedSchema, table, formattedColumnsData);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
    console.log(condition);
    if(condition==2)
    setOperationSelected(true);
  };

  const renderDbChoiceContent = () => {
    return (
      <div>
        <Button onClick={() => handleDbChoice('PostgreSQL')}>PostgreSQL</Button>
        <Button onClick={() => handleDbChoice('MySQL')}>MySQL</Button>
        <Button onClick={() => handleDbChoice('Microsoft SQL Server')}>Microsoft SQL Server</Button>
        {/* Add more buttons for other databases as needed */}
      </div>
    );
  };
  
const renderDialogContent = () => {
    switch (currentStep) {
      case 'dbChoice':
      return renderDbChoiceContent();

      case 'credentials':
        return <PgDetails connectionDetails={connectionDetails} onCredentialsSubmit={handleCredentialsSubmit}/>;
      case 'schemaSelection':
        return (
          <>
            {schemas.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="schema-select-label">Schema</InputLabel>
                <Select
                  labelId="schema-select-label"
                  id="schema-select"
                  value={selectedSchema}
                  label="Schema"
                  onChange={handleSchemaChange}
                >
                  {schemas.map((schema, index) => (
                    <MenuItem key={index} value={schema.schema_name}>{schema.schema_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {tables.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="table-select-label">Table</InputLabel>
                <Select
                  labelId="table-select-label"
                  id="table-select"
                  value={selectedTable}
                  label="Table"
                  onChange={handleTableChange}
                  
                >
                  {tables.map((table, index) => (
                    <MenuItem key={index} value={table.table_name}>{table.table_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      
       <Dialog open={isDbDialogOpen} onClose={() => setOpenDbDialog(false)}>
      <DialogContent>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
    {operationSelected && <Operation />}
    {/* {columns.length > 0 && <ColumnsDisplay columns={columns} />} */}
    {/* <ColumnsDisplay columns={columns} /> */}
    </div>
  );
}

export default Dbcomp1;
