import './HomePage.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CircularProgress, Box, Snackbar } from '@mui/material'; // Добавил Snackbar
import { Card } from '../../components/card/card';
import { AnimationCube } from './ui/animation-cube/animation-cube';
import logoHome from '../../assets/icons/logoHome.svg';
import { createPortal } from 'react-dom';
import OpenOrderForm from '../../components/modals/OrderForm/OrderForm';
import AuthorizationModal from '../../components/modals/AuthorizationModal/AuthorizationModal';
import { useEffect, useState } from 'react';
import type { Service } from '../../types';
import { HOME_UI } from './constants';
import { authorizationService } from '../../services/authorization-service';
import { apiService } from '../../services/api-service.ts'; // Импорт apiService

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service>();
  const [data, setData] = useState<Service[]>();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const result = await apiService<Service[]>('/services/most/used');
        setData(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load services';
        setSnackMessage(errorMessage);
        setSnackOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(authorizationService.isAuthUser());
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleOpenModal = (service: Service) => {
    if (!isAuth) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentService(service);
    setOpen(true);
  };

  return (
    <main className="page-main">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <section className="title-section">
        <AnimationCube position="right" />
        <div className="page-container">
          <div className="title-wrapper">
            <img src={logoHome} alt="Logo" className="title-logo" />
            <h2 className="title-section-title">{HOME_UI.TITLE}</h2>
          </div>
        </div>
      </section>

      <section className="bestseller">
        <AnimationCube position="left" />
        <div className="page-container">
          <div className="bestseller-header">
            <h2 className="bestseller-title">
              {HOME_UI.BESTSELLER_BLOCK.TITLE}
            </h2>
            <a className="bestseller-link" href="/catalog">
              <span>{HOME_UI.BESTSELLER_BLOCK.LINK_TEXT}</span>
              <ArrowForwardIosIcon className="bestseller-arrow-right" />
            </a>
          </div>
          <div className="bestseller-wrapper">
            {loading ? (
              <Box className="loader-container">
                <CircularProgress className="custom-spinner" size={60} />
              </Box>
            ) : (
              data?.map((item) => (
                <Card
                  key={item.id}
                  data={item}
                  handleClick={() => handleOpenModal(item)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {open && createPortal(
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
}