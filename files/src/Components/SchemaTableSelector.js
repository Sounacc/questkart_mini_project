import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select,Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const SchemaTableSelector = ({ connectionDetails, onSelectionComplete }) => {
  const [schemas, setSchemas] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [open, setOpen] = useState(true); // Initially open

  // Fetch schemas based on connection details
  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await fetch('http://localhost:5000/connect-and-fetch-schemas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(connectionDetails),
        });
        if (!response.ok) throw new Error('Failed to fetch schemas');
        const data = await response.json();
        setSchemas(data);
      } catch (error) {
        console.error('Error fetching schemas:', error);
      }
    };

    fetchSchemas();
  }, [connectionDetails]);

  // Fetch tables when a schema is selected
  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedSchema) return;
      try {
        const response = await fetch('http://localhost:5000/fetch-tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...connectionDetails, schema: selectedSchema }),
        });
        if (!response.ok) throw new Error('Failed to fetch tables');
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, [selectedSchema, connectionDetails]);

  const handleSchemaChange = (event) => {
    setSelectedSchema(event.target.value);
    setSelectedTable(''); // Reset table selection when schema changes
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleConfirmSelection = () => {
    onSelectionComplete(selectedSchema, selectedTable);
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle>Select Schema and Table</DialogTitle>
    <DialogContent>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="schema-select-label">Schema</InputLabel>
          <Select
            labelId="schema-select-label"
            id="schema-select"
            value={selectedSchema}
            label="Schema"
            onChange={handleSchemaChange}
          >
            {schemas.map((schema) => (
              <MenuItem key={schema} value={schema}>{schema}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="table-select-label">Table</InputLabel>
          <Select
            labelId="table-select-label"
            id="table-select"
            value={selectedTable}
            label="Table"
            onChange={handleTableChange}
            disabled={!selectedSchema} // Disable until schema is selected
          >
            {tables.map((table) => (
              <MenuItem key={table} value={table}>{table}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button
        variant="contained"
        onClick={handleConfirmSelection}
        disabled={!selectedTable} // Disable until table is selected
      >
        Confirm Selection
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default SchemaTableSelector;
