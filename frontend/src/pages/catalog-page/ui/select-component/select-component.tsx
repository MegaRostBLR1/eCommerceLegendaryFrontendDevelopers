import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { LABEL_STYLE, SELECT_STYLE } from '../../constants';
import { Burger } from '../../../../assets/icons/burger';
import { useEffect, useState } from 'react';
import type { Category } from '../../../../types';

const DEV_URL = import.meta.env.VITE_DEV_URL;

export const SelectComponent = ({
  category,
  setCategory,
}: {
  category: string;
  setCategory: (value: string) => void;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    fetch(`${DEV_URL}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label" sx={LABEL_STYLE}>
        categories
      </InputLabel>
      <Select
        IconComponent={Burger}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={category}
        label="categories"
        onChange={handleChange}
        sx={SELECT_STYLE}
      >
        <MenuItem value="">All</MenuItem>
        {categories.map((item) => (
          <MenuItem value={item.id}>{item.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
