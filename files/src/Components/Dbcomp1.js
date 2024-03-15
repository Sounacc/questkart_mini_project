import React, {useEffect, useState } from 'react';
import { Button, Menu, MenuItem, Dialog, Select, FormControl, InputLabel, DialogContent } from '@mui/material';
import PgDetails from './Pgdetails'; // Import your PgDetails component
import ColumnsDisplay from './ColumnsDropdown'; 
import Operation from './Operations'


function Dbcomp1({ setOpenDbDialog, isDbDialogOpen,onSelections }) {
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

  const handleCredentialsSubmit = (schemas) => {
    setSchemas(schemas);
    setCurrentStep('schemaSelection'); // Move to the next step
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
      const response = await fetch('http://localhost:3000/tables', {
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
      const response = await fetch('http://localhost:3000/columns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema: selectedSchema, table }),
      });
     
      const columnsData = await response.json();
      const columnNames = columnsData.map(column => column.column_name);
      setColumns(columnNames); // Store the column names in the state
      onSelections(selectedDb, selectedSchema, table, columnNames); // Pass the database, schema, table, and columns to the parent component
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
        return <PgDetails onCredentialsSubmit={handleCredentialsSubmit} />;
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
