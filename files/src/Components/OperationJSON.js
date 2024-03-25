/**
 * Creates a JSON object representing the operations to be performed.
 *
 * @param {string} fileName1 - The name of the first file or table from source 1.
 * @param {string} fileName2 - The name of the second file or table from source 2.
 * @param {string} selectionTypeSource1 - The type of selection for source 1 (file or database).
 * @param {string} selectionTypeSource2 - The type of selection for source 2 (file or database).
 * @param {Object} databaseDetails1 - Details of the database for source 1.
 * @param {Object} databaseDetails2 - Details of the database for source 2.
 * @param {Array} selectedColumnsSource1 - Selected columns from source 1.
 * @param {Array} selectedColumnsSource2 - Selected columns from source 2.
 * @param {string} joinType - The type of join operation.
 * @returns {Object} A JSON object representing the operations to be performed.
 */
export default function OperationJSONObject(fileName1, fileName2, selectionTypeSource1, selectionTypeSource2, databaseDetails1, databaseDetails2, selectedColumnsSource1, selectedColumnsSource2, joinType) {
  // Construct the operations object
  const operations = {
    join: {
      join_type: joinType,
      left_source: selectionTypeSource1 === "file" ? fileName1 : databaseDetails1.tableName,
      right_source: selectionTypeSource2 === "database" ? databaseDetails2.tableName : fileName2,
      left_columns: selectedColumnsSource1,
      right_columns: selectedColumnsSource2,
    },
  };

  // Construct the operation json
  return operations;
}
