import React from 'react';
import MultipleSelect from './MultipleSelect';
import PassListsToJSON from './PassListsToJSON';

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

export default function ParentComponent() {
  const [selectedColumnsSource1, setSelectedColumnsSource1] = React.useState([]);
  const [selectedColumnsSource2, setSelectedColumnsSource2] = React.useState([]);

  // Function to handle selections made by the user
  const handleSelections = (selected, sourceLabel) => {
    if (sourceLabel === 'Source1') {
      setSelectedColumnsSource1(selected);
    } else if (sourceLabel === 'Source2') {
      setSelectedColumnsSource2(selected);
    }
  };

  return (
    <div className='flex-container'>
      {/* Render the MultipleSelect component twice, each with different sources and state */}
      <MultipleSelect 
        props={Source1} 
        label="Source1" 
        selected={selectedColumnsSource1} 
        onSelections={handleSelections}
      />
      <MultipleSelect 
        props={Source2} 
        label="Source2" 
        selected={selectedColumnsSource2} 
        onSelections={handleSelections}
      />
  
<PassListsToJSON 
        selectedColumnsSource1={selectedColumnsSource1} 
        selectedColumnsSource2={selectedColumnsSource2} 
      />
    </div>
  );
}
