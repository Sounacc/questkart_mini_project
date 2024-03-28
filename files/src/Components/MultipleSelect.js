import React ,{useEffect}from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
// import Button from '@mui/material/Button';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

/**
 * Component for rendering a multiple select chip input.
 * Allows the user to select multiple options from a list.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onSelections - Function to handle selections made by the user.
 * @param {Array} props.columns - Array of column objects containing name and type.
 * @param {string} props.label - Label for the input field.
 * @returns {React.Component} A React component for multiple select chip input.
 */
function MultipleSelectChip({ onSelections, columns, label,resetTrigger }) {
  const theme = useTheme();
  const [selectedColumns, setSelectedColumns] = React.useState([]);

  /**
   * Handles the change event of the select input.
   *
   * @param {Object} event - The event object.
   */
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    onSelections(value, label);
  };

  React.useEffect(() => {
    // This effect uses the resetTrigger to reset the component's state
    setSelectedColumns([]);
    // You might also want to call onSelections to update the parent state
    // onSelections([], label);
  }, [resetTrigger]);

  // useEffect(() => {
  //   // Effect for handling changes in selected columns
  //   // console.log("Updated Columns are:", selectedColumns);
  // }, [selectedColumns]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id={`demo-multiple-chip-label-${label}`}>{label}</InputLabel>
        <Select
          labelId={`demo-multiple-chip-label-${label}`}
          id={`demo-multiple-chip-${label}`}
          multiple
          value={selectedColumns}
          onChange={handleChange}
          input={<OutlinedInput id={`select-multiple-chip-${label}`} label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {columns.map((column) => (
            <MenuItem
              key={column.name}
              value={`${column.name} (${column.type})`}
              style={getStyles(`${column.name} (${column.type})`, selectedColumns, theme)}
            >
              {`${column.name} (${column.type})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultipleSelectChip;