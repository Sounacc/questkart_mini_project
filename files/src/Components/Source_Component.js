import React from 'react';
import Dropdown from './Dropdown'; // This should be your converted Material-UI Dropdown
import Box from '@mui/material/Box';
import Operation from './Operations'


export default function SourceComponent() {
  const sources = ['Source 1', 'Source 2']; // Fixed sources
  
  return (
  
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', my: 2 }}>
      {/* Flex container for Dropdowns */}
     
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {sources.map((name, index) => (
          <Dropdown key={index} name={name} />
        ))}
      </Box>
     <Operation/>
    </Box>
  );
}
