import { Pagination, CircularProgress, Box } from '@mui/material';
import { Card } from '../../components/card/card';
import styles from './catalog-page.module.css';
import { CARDS_ON_PAGE, PAGINATION_STYLE } from './constants';
import { SelectComponent } from './ui/select-component/select-component';
import { SearchInput } from './ui/search-input/search-input';
import { useEffect, useState, useCallback } from 'react';
import type { Service, ServicesData } from '../../types';
import { createPortal } from 'react-dom';
import OpenOrderForm from '../../components/modals/OrderForm/OrderForm';
import { authorizationService } from '../../services/authorization-service.ts';
import AuthorizationModal from '../../components/modals/AuthorizationModal/AuthorizationModal.tsx';
import { apiService } from '../../services/api-service.ts';
import { useTranslation } from 'react-i18next';

export const CatalogPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<ServicesData>();
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service>();
  const [loading, setLoading] = useState(true);

  const handleOpenModal = (service: Service) => {
    const isAuth = authorizationService.isAuthUser();
    if (!isAuth) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentService(service);
      setOpen(true);
    }
  };

  const getData = useCallback(async () => {
    setLoading(true);

    const categoriesParam = selectedCategories.includes('all')
      ? ''
      : `&categories=${selectedCategories.join(',')}`;

    const searchParam = search ? `&search=${search}` : '';

    const endpoint = `/services?page=${page}&count=${CARDS_ON_PAGE}${categoriesParam}${searchParam}`;

    try {
      const data = await apiService<ServicesData>(endpoint);
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategories, search]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (search.trim() === '') return;
    const timer = setTimeout(() => {
      getData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [search, getData]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <main className={styles.main}>
      <section className={styles.catalog}>
        <div className={styles.container + ' page-container'}>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>{t('catalog.title')}</h1>
            <div className={styles.content}>
              <div className={styles.filters}>
                <div className={styles.categories}>
                  <SelectComponent
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                </div>
                <div className={styles.search}>
                  <SearchInput search={search} setSearch={setSearch} />
                </div>
              </div>

              <div className={styles.cards}>
                {loading ? (
                  <Box className={styles.loaderContainer}>
                    <CircularProgress className={styles.spinner} size={60} />
                  </Box>
                ) : (
                  data?.data?.map((item) => (
                    <Card
                      key={item.id}
                      data={item}
                      handleClick={handleOpenModal}
                    />
                  ))
                )}
              </div>

              {data && data.pages > 1 && (
                <Pagination
                  count={data?.pages}
                  page={page}
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
      {createPortal(
        <AuthorizationModal
          open={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />,
        document.body
      )}
    </main>
  );
};
