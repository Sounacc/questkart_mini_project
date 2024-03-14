import React, { useState } from 'react';
import SourceSelection from './SourceSelector';
import SourceDialog from './SourceDialog';
import FileDialog from './FileDialog';
import DatabaseDialog from './DatabaseDialog';
import { Button, Grid } from '@mui/material';
import { handleSourceChange, handleFileSelection, handleDatabaseInfoChange, handleDatabaseSubmit } from './EventHandlers';
import { generateJsonData, saveJSONToFile } from './jsonutils'; // Import functions from jsonUtils.js

const Interface = () => {
  const [sources, setSources] = useState([
    { type: '', fileLocation: '', databaseInfo: { user: '', password: '', host: 'localhost', port: '5432', database: '' }, openDialog: false }
  ]);

  const addSource = () => {
    setSources([...sources, { type: '', fileLocation: '', databaseInfo: { user: '', password: '', host: 'localhost', port: '5432', database: '' }, openDialog: false }]);
  };

  const removeSource = (index) => {
    const newSources = [...sources];
    newSources.splice(index, 1);
    setSources(newSources);
  };

  const jsonData = generateJsonData(sources);

  const handleViewMergedData = () => {
    saveJSONToFile(jsonData);
  };

  return (
    <div>
      {/* Using Grid to arrange sources in rows */}
      <Grid container spacing={2}>
        {sources.map((source, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <SourceSelection
              value={source.type}
              onChange={handleSourceChange(sources, setSources, index)}
              label={index + 1}
              onAdd={addSource}
              onRemove={() => removeSource(index)}
              isRemovable={index > 0}
              fileLocation={source.fileLocation}
            />
            {/* Render remove button only for additional sources */}
            {index > 0 && <Button variant="contained" onClick={() => removeSource(index)}>-</Button>}
          </Grid>
        ))}
      </Grid>

      {/* Button to add new source */}
      <Button variant="contained" onClick={addSource}>+</Button>

      {/* Render SourceDialog components */}
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

      {/* Button to view merged data */}
      <Button variant="outlined" onClick={handleViewMergedData}>View Merged Data</Button>
    </div>
  );
};

export default Interface;
