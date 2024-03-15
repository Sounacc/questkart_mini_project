import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import FetchColumns from './FetchColumns';

// Constants for MenuProps
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250, // Default width
    },
  },
};


/**
 * Get styles for menu items based on selected or unselected state.
 * 
 * @param {string} name - The name of the menu item.
 * @param {string[]} sourceName - Array of selected menu item names.
 * @param {Object} theme - The MUI theme object.
 * @returns {Object} - Styles object for the menu item.
 */
function getStyles(name, sourceName, theme) {
  return {
    fontWeight:
      sourceName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

/**
 * Component for rendering a multiple select chip input.
 * 
 * @param {Object} props - The props object.
 * @param {string} props.label - The label for the input.
 * @param {Array} props.props - The array of selectable options.
 * @returns {JSX.Element} - The JSX for the multiple select chip input.
 */
function MultipleSelectChip(props) {
  const theme = useTheme();
  const [sourceName, setSourceName] = React.useState([]);

  /**
   * Handles the change event of the select input.
   * 
   * @param {Event} event - The event object.
   */
  const handleChange = (event) => {
    try {
      const {
        target: { value },
      } = event;
      setSourceName(value);
    } catch (error) {
      console.error('Error in handleChange:', error);
    }
  };

  // Calculate control width based on label length
  const sourceNameLength = props.label ? props.label.length : 0;
  const controlWidth = 300 + sourceNameLength * 8;

  return (
    <div>
      <FormControl sx={{ m: 1, width: controlWidth }}>
        <InputLabel id={`demo-multiple-chip-label-${props.label}`}>
          {props.label}
        </InputLabel>
        <Select
          labelId={`demo-multiple-chip-label-${props.label}`}
          id={`demo-multiple-chip-${props.label}`}
          multiple
          value={sourceName}
          onChange={handleChange}
          input={<OutlinedInput id={`select-multiple-chip-${props.label}`} label={props.label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {props.props.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, sourceName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FetchColumns variableValue={sourceName}  />
    </div>  
  );
}

export default MultipleSelectChip;