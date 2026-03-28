import { Search } from '@mui/icons-material';
import styles from './search-input.module.css';
import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

export const SearchInput = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(search);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    if (value.length > 0 && value.length < 3) return;
    setSearch(value);
  };

  return (
    <>
      <input
        value={value}
        onChange={handleChange}
        id="service-search"
        name="serviceName"
        className={styles.search_input}
        type="text"
        placeholder={t('catalog.searchPlaceholder')}
      />
      <Search className={styles.search_icon} />
    </>
  );
};
