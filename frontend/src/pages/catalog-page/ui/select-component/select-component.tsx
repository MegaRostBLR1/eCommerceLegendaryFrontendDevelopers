import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { LABEL_STYLE, SELECT_STYLE } from '../../constants';
import { Burger } from '../../../../assets/icons/burger';

export const SelectComponent = () => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label" sx={LABEL_STYLE}>
        categories
      </InputLabel>
      <Select
        IconComponent={Burger}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value=""
        label="categories"
        onChange={() => {}}
        sx={SELECT_STYLE}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};
