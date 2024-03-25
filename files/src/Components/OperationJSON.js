export default function OperationJSONObject(fileName1, fileName2, selectionTypeSource1,selectionTypeSource2,databaseDetails1,databaseDetails2, selectedColumnsSource1, selectedColumnsSource2, joinType ) {
    // Construct the operations object
    const operations = {
      join: {
        join_type: joinType,
        left_source: selectionTypeSource1==="file" ? fileName1 : databaseDetails1.tableName,
        right_source: selectionTypeSource2 === "database" ? databaseDetails2.tableName : fileName2,
        left_columns: selectedColumnsSource1,
        right_columns: selectedColumnsSource2,
      },
    };
  
    // Construct the operation json
    return operations;
  }
  
  