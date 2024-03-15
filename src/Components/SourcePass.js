import React from 'react';
import MultipleSelect from './MultiSelectDropDown';

export default function ParentComponent() {
  // Define or fetch the names array
  const Source1 = [
    'Column 1',
    'Column 2',    
    'Column 3',
    'Column 4',
    'Column 5',
    'Column 6',
    'Column 7',
    'Column 8',
    'Column 9',
    'Column 10',
  ];

  const Source2 = [
    'Column 11',
    'Column 22',    
    'Column 33',
    'Column 44',
    'Column 55',
    'Column 66',
    'Column 77',
    'Column 88',
    'Column 99',
    'Column 100',
  ];

  return (
    <div className='flex-container'>
      {/* Render the MultipleSelect component and pass the names array as a prop */}
      <MultipleSelect props={Source1} label="Source1" />
      <MultipleSelect props={Source2} label="Source2" />
    </div>
  );
}