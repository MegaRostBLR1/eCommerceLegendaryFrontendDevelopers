import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Box,
  Chip,
} from '@mui/material';
import { LABEL_STYLE, SELECT_STYLE } from '../../constants';
import { Burger } from '../../../../assets/icons/burger';
import { useEffect, useState } from 'react';
import type { Category } from '../../../../types';
import { TEXT_SELECT } from './constants';
import { environment } from '../../../../assets/environment/environment.ts';

const BASE_URL = environment.baseUrl;

interface SelectComponentProps {
  category: string | number[];
  setCategory: (value: string | number[]) => void;
  multiple?: boolean;
  label?: string;
}

export const SelectComponent = ({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = Array.isArray(event.target.value)
      ? event.target.value
      : [event.target.value];

    if (
      (value?.includes('all') && !selectedCategories.includes('all')) ||
      !value.length
    ) {
      setSelectedCategories(['all']);
      return;
    }

    setSelectedCategories(value.filter((item) => item !== 'all'));
  };

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label" sx={LABEL_STYLE}>
        {TEXT_SELECT.CATEGORIES}
      </InputLabel>
      <Select
        multiple
        IconComponent={Burger}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedCategories}
        label="categories"
        onChange={handleChange}
        sx={SELECT_STYLE}
        renderValue={(selected) => {
          if (selected.includes('all')) return 'All';
          return categories
            .filter((item) => selected.includes(item.id.toString()))
            .map((c) => c.name)
            .join(', ');
        }}
      >
        <MenuItem value="all">
          <Checkbox checked={selectedCategories.includes('all')} />
          <ListItemText primary="All" />
        </MenuItem>
        {categories.map((item) => (
          <MenuItem key={item.id} value={item.id.toString()}>
            <Checkbox
              checked={selectedCategories.indexOf(item.id.toString()) > -1}
            />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
