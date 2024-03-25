import React, { useState } from 'react';
import SourceComponent from './Source_Component';
import BasicExample from './Dropdown';
import JoinOperationSelect from './Operations';
import Pgdetails from './Pgdetails';

/**
 * Parent component that manages the state and renders child components for data comparison.
 * Handles database connections, source selection, and join operation selection.
 *
 * @returns {React.Component} A React component for managing data comparison.
 */
function ParentComponent() {
  // State to hold various props
  const [databaseDetails, setDatabaseDetails] = useState({
    databaseName: '',
    schemaName: '',
    tableName: '',
  });
  const [fileName, setFileName] = useState('');
  const [selectionType1, setSelectionType1] = useState('');
  const [selectedColumnsSource1, setSelectedColumnsSource1] = useState([]);
  const [selectedColumnsSource2, setSelectedColumnsSource2] = useState([]);
  const [joinType, setJoinType] = useState('');
  const [connectionDetails, setConnectionDetails] = useState({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  });

  // Function to handle setting connection details
  const handleConnectionDetailsSubmit = (data) => {
    setConnectionDetails(data);
  };

  return (
    <div>
      {/* Render components and pass required props */}
      <Pgdetails onCredentialsSubmit={handleConnectionDetailsSubmit} />
      <BasicExample
        onColumnsSelected={(columns) => {
          // Update fileName and selectionType
          setFileName(columns.length > 0 ? columns[0].name : '');
          setSelectionType('file');
        }}
        name="Basic Example"
      />
      <SourceComponent
        databaseDetails={databaseDetails}
        fileName={fileName}
        selectedColumnsSource1={selectedColumnsSource1}
        selectedColumnsSource2={selectedColumnsSource2}
      />
      <JoinOperationSelect
        selectedColumnsSource1={selectedColumnsSource1}
        selectedColumnsSource2={selectedColumnsSource2}
        joinType={joinType}
        setJoinType={setJoinType}
      />
    </div>
  );
}

export default ParentComponent;
