import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';

export default function PgDetails(props) {
  const [connectionDetails, setConnectionDetails] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });

  const [errors, setErrors] = useState({
    user: false,
    host: false,
    database: false,
    password: false,
    port: false,
    general: '' // General error message
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConnectionDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };

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
      if (data.errors) {
        setErrors(prevErrors => ({ ...prevErrors, ...data.errors }));
      } else {
        props.onCredentialsSubmit(data, connectionDetails); // Handle successful submission
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prevErrors => ({
        ...prevErrors,
        general: 'An unexpected error occurred. Please try again later.'
      }));
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
      {errors.general && <Alert severity="error" sx={{ marginBottom: 2 }}>{errors.general}</Alert>}
      <div>
        <TextField
          error={errors.user}
          helperText={errors.user ? "Invalid user" : ""}
          required
          name="user"
          label="User"
          value={connectionDetails.user}
          onChange={handleChange}
        />
        <TextField
          error={errors.host}
          helperText={errors.host ? "Invalid host" : ""}
          required
          name="host"
          label="Host"
          value={connectionDetails.host}
          onChange={handleChange}
        />
        <TextField
          error={errors.database}
          helperText={errors.database ? "Invalid database" : ""}
          required
          name="database"
          label="Database"
          value={connectionDetails.database}
          onChange={handleChange}
        />
        <TextField
          error={errors.password}
          helperText={errors.password ? "Invalid password" : ""}
          required
          name="password"
          label="Password"
          type="password"
          value={connectionDetails.password}
          onChange={handleChange}
        />
        <TextField
          error={errors.port}
          helperText={errors.port ? "Invalid port" : ""}
          required
          name="port"
          label="Port"
          type="number"
          value={connectionDetails.port}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" variant="contained" sx={{ m: 1 }}>
        Submit
      </Button>
    </Box>
  );
}
