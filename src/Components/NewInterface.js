import React, { useState } from 'react';
import SourceSelection from './SourceSelector';
import SourceDialog from './SourceDialog';
import FileDialog from './FileDialog';
import DatabaseDialog from './DatabaseDialog';
import OperationButton from './OperationButton'; // Import OperationButton component
import { Grid } from '@mui/material';
import { handleSourceChange, handleFileSelection, handleDatabaseInfoChange, handleDatabaseSubmit, handleOperationChange } from './EventHandlers';
import './NewInterface.css';
import operations from './ConstOperation';

const NewInterface = () => {
  const [sources, setSources] = useState([
    { type: '', fileLocation: '', databaseInfo: { user: '', password: '', host: 'localhost', port: '5432', database: '' }, openDialog: false },
    { type: '', fileLocation: '', databaseInfo: { user: '', password: '', host: 'localhost', port: '5432', database: '' }, openDialog: false }
  ]);
  const [selectedOperation, setSelectedOperation] = useState('');

  return (
    <div>
      <Grid className="sources-container" container spacing={2}>
        {sources.map((source, index) => (
          <Grid item xs={12} sm={3} key={index}>
            <SourceSelection
              value={source.type}
              onChange={handleSourceChange(sources, setSources, index)}
              label={index + 1}
              fileLocation={source.fileLocation}
            />
          </Grid>
        ))}
      </Grid>

      {sources.map((source, index) => (
        <SourceDialog
          key={index}
          open={source.openDialog}
          onClose={() => {
            const newSources = [...sources];
            newSources[index].openDialog = false;
            setSources(newSources);
          }}
          title={`Select ${source.type === 'file' ? 'File' : 'Database'} ${index + 1}`}
        >
          {source.type === 'file' ? (
            <FileDialog handleFileSelection={handleFileSelection(sources, setSources, index)} />
          ) : (
            <DatabaseDialog
              databaseInfo={source.databaseInfo}
              handleDatabaseInfoChange={handleDatabaseInfoChange(sources, setSources, index)}
              handleDatabaseSubmit={handleDatabaseSubmit(sources, setSources, index)}
            />
          )}
        </SourceDialog>
      ))}

      {/* Render OperationButton component */}
      <OperationButton
        selectedOperation={selectedOperation}
        setSelectedOperation={setSelectedOperation}
        operations={operations}
        handleOperationChange={handleOperationChange}
      />
    </div>
  );
};

export default NewInterface;
