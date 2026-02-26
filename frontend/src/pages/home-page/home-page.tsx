import './home-page.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card } from '../../components/card/card';
import { AnimationCube } from './ui/animation-cube/animation-cube';
import logoHome from '../../assets/icons/logoHome.svg';
import { createPortal } from 'react-dom';
import OpenOrderForm from '../modals/OrderForm/OrderForm';
import { useState } from 'react';
import type { Service } from '../../types';

const DATA = [
  {
    name: 'Creating a video',
    amount: 167,
    description: 'Description',
    id: 1,
  },
  {
    name: 'Creating a video',
    amount: 167,
    description: 'Description',
    id: 2,
  },
  {
    name: 'Creating a video',
    amount: 167,
    description: 'Description',
    id: 3,
  },
  {
    name: 'Creating a video',
    amount: 167,
    description:
      'lorem ipsum dolor sit amet consectetur, lorem ipsum dolor sit amet consectetur',
    id: 4,
  },
];

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service>();

  const handleOpenModal = (service: Service) => {
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
            <h2 className="title-section-title">Services from AI</h2>
          </div>
        </div>
      </section>

      <section className="bestseller">
        <AnimationCube position="left" />
        <div className="page-container">
          <div className="bestseller-header">
            <h2 className="bestseller-title">A HIT OF SALES</h2>
            <a className="bestseller-link" href="/catalog/services">
              <span>All services</span>
              <ArrowForwardIosIcon className="bestseller-arrow-right" />
            </a>
          </div>
          <div className="bestseller-wrapper">
            {DATA.map((item) => (
              <Card
                key={item.id}
                data={item}
                handleClick={() => handleOpenModal(item)}
              />
            ))}
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
}
