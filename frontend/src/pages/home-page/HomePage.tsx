import './HomePage.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CircularProgress, Box } from '@mui/material';
import { Card } from '../../components/card/card';
import { AnimationCube } from './ui/animation-cube/animation-cube';
import logoHome from '../../assets/icons/logoHome.svg';
import { createPortal } from 'react-dom';
import OpenOrderForm from '../../components/modals/OrderForm/OrderForm';
import AuthorizationModal from '../../components/modals/AuthorizationModal/AuthorizationModal.tsx';
import { useEffect, useState } from 'react';
import type { Service } from '../../types';
import { HOME_UI } from './constants';
import { environment } from '../../assets/environment/environment.ts';
import { authorizationService } from '../../services/authorization-service.ts';

const BASE_URL = environment.baseUrl;

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service>();
  const [data, setData] = useState<Service[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/services/most/used`)
      .then((response) => response.json())
      .then((data: Service[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (service: Service) => {
    const isAuth = authorizationService.isAuthUser();
    if (!isAuth) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentService(service);
    setOpen(true);
  };

  return (
    <main className="page-main">
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