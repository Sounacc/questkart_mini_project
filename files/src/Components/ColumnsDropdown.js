import React from 'react';
import MultipleSelect from './MultipleSelect';
import Operation from './Operations'

function ColumnsDisplay({ columns }) {
    
    
      
    
      return (
        <>
        {/* <div className="flex-container">
         <Operation/>
        </div> */}
        <div className='flex-container'>
          {/* Render the MultipleSelect component and pass the names array as a prop */}
          <MultipleSelect props={columns} label="Field Columns" />
          {/* <MultipleSelect props={Source2} label="Source2" /> */}
        </div>
        </>
      );
}

export default ColumnsDisplay;
