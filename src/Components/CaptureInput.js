const CaptureInput = (sources) => {
    const capturedData = {
      sources: {},
      operations: {}
    };
  
    // Capture data for each source
    sources.forEach((source, index) => {
      const sourceKey = `source_${index + 1}`;
      capturedData.sources[sourceKey] = {};
  
      if (source.type === 'file') {
        capturedData.sources[sourceKey].source_type = 'files';
        capturedData.sources[sourceKey].location = source.fileLocation;
      } else if (source.type === 'database') {
        capturedData.sources[sourceKey].source_type = 'database';
        capturedData.sources[sourceKey] = {
          ...capturedData.sources[sourceKey],
          ...source.databaseInfo
        };
      }
    });
  
    // Capture data for each operation
    /*selectedOperation.forEach((operation, index) => {
      const operationKey = `join_${index + 1}`;
      capturedData.operations[operationKey] = {
        join_type: 'inner', // Assuming default join type is inner
        left_source: 'Source1', // Assuming default left source name
        right_source: 'Source2', // Assuming default right source name
        left_columns: [], // Placeholder for left column names
        right_columns: [] // Placeholder for right column names
      };
  
      // You would need to modify this part based on how you get the left and right source names and column names
      // For now, assuming they are static and fixed
      if (index === 0) {
        capturedData.operations[operationKey].left_source = 'Source1';
        capturedData.operations[operationKey].right_source = 'Source2';
      } else if (index === 1) {
        capturedData.operations[operationKey].left_source = 'Source2';
        capturedData.operations[operationKey].right_source = 'Source3';
      }
    });*/
    console.log(capturedData);
    return capturedData;
  };
  
  export default CaptureInput;
  