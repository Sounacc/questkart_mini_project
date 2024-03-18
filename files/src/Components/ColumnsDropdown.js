import React from 'react';
import MultipleSelect from './MultipleSelect';
import Operation from './Operations';

// ColumnsDisplay component remains largely the same,
// but make sure to pass the entire columns object to MultipleSelectChip.
function ColumnsDisplay({ columns, label }) {
  return (
    <>
      <div className='flex-container'>
        <MultipleSelect props={columns} label={label} />
      </div>
    </>
  );
}


export default ColumnsDisplay;
