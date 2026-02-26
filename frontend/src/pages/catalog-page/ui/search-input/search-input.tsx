import { Search } from '@mui/icons-material';
import styles from './search-input.module.css';
import type { ChangeEvent } from 'react';

export const SearchInput = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <input
        value={search}
        onChange={handleChange}
        id="service-search"
        name="serviceName"
        className={styles.search_input}
        type="text"
        placeholder="Enter the name of the service"
      />
      <Search className={styles.search_icon} />
    </>
  );
};
