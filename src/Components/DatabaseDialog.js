import React from 'react';
import { TextField, Button } from '@mui/material';

const DatabaseDialog = ({ databaseInfo, handleDatabaseInfoChange, handleDatabaseSubmit }) => {
  return (
    <div className="DB_credentials">
      <TextField label="User" name="user" value={databaseInfo.user} onChange={handleDatabaseInfoChange} />
      <TextField label="Password" name="password" value={databaseInfo.password} onChange={handleDatabaseInfoChange} />
      <TextField label="Host" name="host" value={databaseInfo.host} onChange={handleDatabaseInfoChange} />
      <TextField label="Port" name="port" value={databaseInfo.port} onChange={handleDatabaseInfoChange} />
      <TextField label="Database" name="database" value={databaseInfo.database} onChange={handleDatabaseInfoChange} />
      <br />
      <Button onClick={handleDatabaseSubmit}>Submit</Button>
    </div>
  );
};

export default DatabaseDialog;
