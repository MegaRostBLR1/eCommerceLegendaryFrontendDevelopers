import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  type SelectChangeEvent,
} from '@mui/material';
import { LABEL_STYLE, SELECT_STYLE } from '../../constants';
import { Burger } from '../../../../assets/icons/burger';
import { useEffect, useState } from 'react';
import type { Category } from '../../../../types';
import { apiService } from '../../../../services/api-service.ts';
import { useTranslation } from 'react-i18next';

export const SelectComponent = ({
  selectedCategories = [],
  setSelectedCategories = () => {},
}: {
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (!value) return;

    const normalizedValue = Array.isArray(value) ? value : [value];
    const clickedAll = normalizedValue.includes('all');

    const isEverythingSelected =
      categories.length > 0 && selectedCategories.length === categories.length;

    if (clickedAll) {
      if (isEverythingSelected) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(categories.map((cat) => cat.id.toString()));
      }
      return;
    }

    setSelectedCategories(normalizedValue.filter((v) => v !== 'all'));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService<Category[]>('/categories');
        setCategories(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('catalog.errorCategories');
        setSnackMessage(errorMessage);
        setSnackOpen(true);
      }
    };
    fetchCategories();
  }, [t]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" sx={LABEL_STYLE}>
          {t('catalog.categories')}
        </InputLabel>
        <Select
          multiple
          IconComponent={Burger}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCategories || []}
          label={t('catalog.categories')}
          onChange={handleChange}
          sx={SELECT_STYLE}
          renderValue={(selected) => {
            if (categories.length > 0 && selected.length === categories.length)
              return t('catalog.all');
            return categories
              .filter((item) => selected.includes(item.id.toString()))
              .map((c) => c.name)
              .join(', ');
          }}
        >
          <MenuItem value="all">
            <Checkbox
              checked={
                categories.length > 0 &&
                selectedCategories.length === categories.length
              }
            />
            <ListItemText primary={t('catalog.all')} />
          </MenuItem>
          {categories.map((item) => (
            <MenuItem key={item.id} value={item.id.toString()}>
              <Checkbox
                checked={selectedCategories.includes(item.id.toString())}
              />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
