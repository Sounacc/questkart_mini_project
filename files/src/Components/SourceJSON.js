/**
 * Function for creating a JSON object representing a data source.
 * Constructs a JSON object containing information about a data source, 
 * including its type (file or database), location, and connection details.
 *
 * @param {Object} databaseDetails - Details of the database (databaseName, schemaName, tableName).
 * @param {string} fileName - Name of the file if the source is a file.
 * @param {string} selectionType - Type of selection (file or database).
 * @param {Object} connectionDetails - Details of the database connection (user, password, host, port).
 * @returns {Object} A JSON object representing the source.
 */
export default function SourceJSONObject(databaseDetails, fileName, selectionType, connectionDetails) {
  // Construct the sources object
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
