export default function SourceJSONObject(databaseDetails, fileName, selectionType, connectionDetails) {
    // Construct the sources object
    console.log()
    const sources = {
      source: {
        source_type: selectionType === 'file' ? 'files' : 'database',
        location: selectionType === 'file' ? fileName : null,
        user: selectionType === 'database' ? connectionDetails.user : null,
        password: selectionType === 'database' ? connectionDetails.password : null,
        host: selectionType === 'database' ? connectionDetails.host : null,
        port: selectionType === 'database' ? connectionDetails.port : null,
        database: selectionType === 'database' ? databaseDetails.databaseName : null,
        schema: selectionType === 'database' ? databaseDetails.schemaName : null,
        table_query: selectionType === 'database' ? databaseDetails.tableName : null,
      },
    };
    return sources;
  }