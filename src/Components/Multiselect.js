import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

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

function MultipleSelectChip(props) {
  const theme = useTheme();
  const { label, props: columns, onSelections } = props;
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);

    // Pass the selected columns back to the parent component
    onSelections(value, label);
  };

  const sourceNameLength = label ? label.length : 0;
  const controlWidth = 300 + sourceNameLength * 8;

  return (
    <div>
      <FormControl sx={{ m: 1, width: controlWidth }}>
        <InputLabel id={`demo-multiple-chip-label-${label}`}>{label}</InputLabel>
        <Select
          labelId={`demo-multiple-chip-label-${label}`}
          id={`demo-multiple-chip-${label}`}
          multiple
          value={personName}
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
          {columns.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultipleSelectChip;
