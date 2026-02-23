import { Search } from '@mui/icons-material';
import styles from './search-input.module.css';

export const SearchInput = () => {
  return (
    <>
      <input
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
