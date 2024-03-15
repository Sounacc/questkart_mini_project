import React from 'react';

/**
 * Functional component for fetching columns.
 * 
 * @param {Object} props - The props object.
 * @param {string} props.variableValue - The value of the variable.
 * @returns {JSX.Element} - The JSX for rendering the fetched columns.
 */
const FetchColumns = ({ variableValue }) => {
  return (
    <div>
      <h2>Fetch Columns Component</h2>
      <p>Value of the variable: {variableValue}</p>
    </div>
  );
}

export default FetchColumns;
