import {
  FormControl,
  InputLabel,
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
import { environment } from '../../../../assets/environment/environment.ts';

const BASE_URL = environment.baseUrl;

interface SelectComponentProps {
  category: string | number[];
  setCategory: (value: string | number[]) => void;
  multiple?: boolean;
  label?: string;
}

export const SelectComponent = ({
  category,
  setCategory,
  multiple = false,
  label = 'categories',
}: SelectComponentProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof category>) => {
    const { value } = event.target;
    setCategory(value);
  };

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="category-select-label" sx={LABEL_STYLE}>
        {label}
      </InputLabel>
      <Select
        multiple={multiple}
        IconComponent={Burger}
        labelId="category-select-label"
        id="category-select"
        value={category}
        label={label}
        onChange={handleChange}
        sx={SELECT_STYLE}
        renderValue={
          multiple
            ? (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map((value) => (
                    <Chip
                      key={value}
                      label={
                        categories.find((c) => c.id === value)?.name || value
                      }
                      size="small"
                    />
                  ))}
                </Box>
              )
            : undefined
        }
      >
        {!multiple && <MenuItem value="">All</MenuItem>}
        {categories.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
