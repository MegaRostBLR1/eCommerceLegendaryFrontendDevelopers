import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Button, CircularProgress, Box, Snackbar } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Card } from '../../../components/card/card';
import { userService } from '../../../services/user.service';
import type { ServicesData, Service } from '../../../types';
import { SelectComponent } from '../../catalog-page/ui/select-component/select-component';
import { SearchInput } from '../../catalog-page/ui/search-input/search-input';
import { CARDS_ON_PAGE, PAGINATION_STYLE } from '../../catalog-page/constants';
import catalogStyles from '../../catalog-page/catalog-page.module.css';
import EditCardModal from '../../../components/modals/EditCardModal/EditCardModal';
import './ServicesPage.css';
import { apiService } from '../../../services/api-service.ts';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ServicesData>();
  const [category, setCategory] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = `/services?page=${page}&count=${CARDS_ON_PAGE}${
        category.length > 0 ? `&categories=${category.join(',')}` : ''
      }${search ? `&search=${search}` : ''}`;

      const result = await apiService<ServicesData>(endpoint);
      setData(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load services';
      setSnackMessage(errorMessage);
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await userService.deleteService(id);
        if (data?.data) {
          setData({
            ...data,
            data: data.data.filter((s) => s.id !== id),
          });
        }
      } catch {
        setSnackMessage('Delete failed');
        setSnackOpen(true);
      }
    }
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <main className={catalogStyles.main}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <section className={catalogStyles.catalog}>
        <div className={catalogStyles.container + ' page-container'}>
          <div className={catalogStyles.wrapper}>
            <div className="admin-header-block">
              <h1 className={catalogStyles.title}>Admin Service Management</h1>

              <Button
                variant="contained"
                className="ai-gen-button"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => navigate('/admin/create-ai')}
              >
                AI Generation
              </Button>
            </div>

            <div className={catalogStyles.content}>
              <div className={catalogStyles.filters}>
                <div className={catalogStyles.categories}>
                  <SelectComponent
                    selectedCategories={category}
                    setSelectedCategories={(val: string[]) => {
                      setCategory(val);
                      setPage(1);
                    }}
                  />
                </div>
                <div className={catalogStyles.search}>
                  <SearchInput search={search} setSearch={setSearch} />
                </div>
              </div>

              <div className={catalogStyles.cards}>
                {loading ? (
                  <Box className="loader-container">
                    <CircularProgress className="custom-spinner" size={60} />
                  </Box>
                ) : (
                  data?.data?.map((item) => (
                    <Card
                      key={item.id}
                      data={item}
                      handleClick={() => handleEditClick(item)}
                      isAdminMode={true}
                      onDelete={handleDelete}
                      onUpdateSuccess={loadServices}
                    />
                  ))
                )}
              </div>

              {data && data.pages > 1 && (
                <Pagination
                  count={data.pages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  variant="outlined"
                  shape="rounded"
                  sx={PAGINATION_STYLE}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      {selectedService && (
        <EditCardModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
          onUpdateSuccess={() => {
            loadServices();
            setIsModalOpen(false);
          }}
          isDraft={false}
        />
      )}
    </main>
  );
};
