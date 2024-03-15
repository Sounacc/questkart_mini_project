import React, { useState } from 'react';
import Papa from 'papaparse';
import {handleSourceChange } from './EventHandlers';

const CsvHandler = () => {
  const [sources, setSources] = useState([
    { type: '', fileLocation: '', columnHeaders: [], openDialog: false },
  ]);

  const getCsvColumnHeaders = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        Papa.parse(csvData, {
          complete: (result) => {
            if (result.data.length > 0 && result.data[0].length > 0) {
              resolve(result.data[0]);
            } else {
              reject(new Error('No data found in the CSV file.'));
            }
          },
          header: false,
        });
      };
      reader.readAsText(file);
    });
  };

  const handleFileSelectionWithHeader = (index) => async (event) => {
    const file = event.target.files[0];
    const columnHeaders = await getCsvColumnHeaders(file);
    const newSources = [...sources];
    newSources[index].fileLocation = file.name;
    newSources[index].columnHeaders = columnHeaders;
    newSources[index].openDialog = false;
    setSources(newSources);
  };

  return (
    <div>
      {sources.map((source, index) => (
        <div key={index}>
          <select value={source.type} onChange={handleSourceChange(sources, setSources, index)}>
            <option value="">Select Type</option>
            <option value="file">File</option>
            <option value="database">Database</option>
          </select>
          {source.type === 'file' && (
            <>
              <input type="file" onChange={handleFileSelectionWithHeader(index)} />
              <div>Column Headers: {source.columnHeaders.join(', ')}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CsvHandler;
