import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

/**
 * Component for collecting PostgreSQL connection details.
 * Allows the user to input PostgreSQL connection parameters.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onCredentialsSubmit - Function to handle submission of connection details.
 * @returns {React.Component} A React component for collecting PostgreSQL connection details.
 */
export default function Pgdetails(props) {
  const [connectionDetails, setConnectionDetails] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });

  /**
   * Handles changes in input fields and updates connectionDetails state.
   *
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConnectionDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  /**
   * Handles form submission and triggers the onCredentialsSubmit callback.
   *
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionDetails),
      });
      const data = await response.json();
      console.log('Submission Response:', data);
      props.onCredentialsSubmit(data, connectionDetails); // Pass connectionDetails here
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
      <div>
        <TextField required name="user" label="User" value={connectionDetails.user} onChange={handleChange} />
        <TextField required name="host" label="Host" value={connectionDetails.host} onChange={handleChange} />
        <TextField required name="database" label="Database" value={connectionDetails.database} onChange={handleChange} />
        <TextField required name="password" label="Password" type="password" value={connectionDetails.password} onChange={handleChange} />
        <TextField required name="port" label="Port" type="number" value={connectionDetails.port} onChange={handleChange} />
      </div>
      <Button type="submit" variant="contained" sx={{ m: 1 }}>
        Submit
      </Button>
    </Box>
  );
}
