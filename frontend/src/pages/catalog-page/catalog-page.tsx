import { Pagination } from '@mui/material';
import { Card } from '../../components/card/card';
import styles from './catalog-page.module.css';
import { PAGINATION_STYLE } from './constants';
import { SelectComponent } from './ui/select-component/select-component';
import { SearchInput } from './ui/search-input/search-input';

const DATA = [
  {
    title: 'titl',
    price: 100,
    description: 'description',
    id: 1,
  },
  {
    title: 'tit',
    price: 10,
    description: 'description',
    id: 2,
  },
  {
    title: 'ti',
    price: 10,
    description: 'description',
    id: 3,
  },
  {
    title: 't',
    price: 1000,
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam purus sit amet luctus venenatis description description urus sit amet luctus venenatis description urus sit amet luctus venenatisdescription urus sit amet luctus venenatis',
    id: 4,
  },
  {
    title: 'titl',
    price: 100,
    description: 'description',
    id: 12,
  },
  {
    title: 'tit',
    price: 10,
    description: 'description',
    id: 22,
  },
  {
    title: 'ti',
    price: 10,
    description: 'description',
    id: 32,
  },
];

export const CatalogPage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.catalog}>
        <div className={styles.container + ' page-container'}>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>services</h1>
            <div className={styles.content}>
              <div className={styles.filters}>
                <div className={styles.categories}>
                  <SelectComponent />
                </div>
                <div className={styles.search}>
                  <SearchInput />
                </div>
              </div>
              <div className={styles.cards}>
                {DATA.map((item) => (
                  <Card
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    description={item.description}
                  />
                ))}
              </div>
              <Pagination
                count={4}
                onChange={(_, page) => console.log(page)}
                variant="outlined"
                shape="rounded"
                sx={PAGINATION_STYLE}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
