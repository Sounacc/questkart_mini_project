import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
// import styles from './MultipleSelectChip.module.css';

// import ChildComponent from './NewFormat_displayValues';

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
  const [personName1, setPersonName1] = React.useState([]);
  const [personName2, setPersonName2] = React.useState([]);

  const handleChange = (event, dropdown) => {
    const {
      target: { value },
    } = event;
    if (dropdown === 1) {
      setPersonName1(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    } else if (dropdown === 2) {
      setPersonName2(
        typeof value === 'string' ? value.split(',') : value,
      );
    }
  };

  const combinedValues = [...personName1, ...personName2];

  const sourceNameLength = props.label ? props.label.length : 0;
  const controlWidth = 300 + sourceNameLength * 8; // Adjust width based on source name length

  return (
    <div>
      <FormControl  sx={{ m: 1, width: controlWidth }}>
        <InputLabel id={`demo-multiple-chip-label-${props.label}`}>{props.label}</InputLabel>
        <Select
          labelId={`demo-multiple-chip-label-${props.label}`}
          id={`demo-multiple-chip-${props.label}`}
          multiple
          value={props.label === 'Source1' ? personName1 : personName2}
          onChange={(e) => handleChange(e, props.label === 'Source1' ? 1 : 2)}
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
              style={getStyles(name, props.label === 'Source1' ? personName1 : personName2, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <ChildComponent variableValue={combinedValues} /> */}
    </div>  
  );
}

export default MultipleSelectChip;
