import { Pagination } from '@mui/material';
import { Card } from '../../components/card/card';
import styles from './catalog-page.module.css';
import { CARDS_ON_PAGE, PAGINATION_STYLE } from './constants';
import { SelectComponent } from './ui/select-component/select-component';
import { SearchInput } from './ui/search-input/search-input';
import { useEffect, useState } from 'react';
import type { Service, ServicesData } from '../../types';
import { createPortal } from 'react-dom';
import OpenOrderForm from '../../components/modals/OrderForm/OrderForm';

const DEV_URL = import.meta.env.VITE_DEV_URL;

export const CatalogPage = () => {
  const [data, setData] = useState<ServicesData>();
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service>();

  const handleOpenModal = (service: Service) => {
    setCurrentService(service);
    setOpen(true);
  };

  useEffect(() => {
    fetch(
      `${DEV_URL}/services?page=${page}&count=${CARDS_ON_PAGE}${category ? `&categories=${category}` : ''}${search ? `&search=${search}` : ''}`
    )
      .then((response) => response.json())
      .then((data: ServicesData) => setData(data));
  }, [category, page, search]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <main className={styles.main}>
      <section className={styles.catalog}>
        <div className={styles.container + ' page-container'}>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>services</h1>
            <div className={styles.content}>
              <div className={styles.filters}>
                <div className={styles.categories}>
                  <SelectComponent
                    category={category}
                    setCategory={setCategory}
                  />
                </div>
                <div className={styles.search}>
                  <SearchInput search={search} setSearch={setSearch} />
                </div>
              </div>
              <div className={styles.cards}>
                {data?.data?.map((item) => (
                  <Card
                    key={item.id}
                    data={item}
                    handleClick={handleOpenModal}
                  />
                ))}
              </div>
              {data && data.pages > 1 && (
                <Pagination
                  count={data?.pages}
                  onChange={(_, page) => handlePageChange(page)}
                  variant="outlined"
                  shape="rounded"
                  sx={PAGINATION_STYLE}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      {createPortal(
        <OpenOrderForm
          open={open}
          onClose={() => setOpen(false)}
          service={currentService}
        />,
        document.body
      )}
    </main>
  );
};
