import './HomePage.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card } from './ui/card/card';
import { AnimationCube } from './ui/animation-cube/animation-cube';
import logoHome from '../../assets/icons/logoHome.svg';

const DATA = [
  {
    title: 'Creating a video',
    price: 167,
    description: 'Description',
    id: 1,
  },
  {
    title: 'Creating a video',
    price: 167,
    description: 'Description',
    id: 2,
  },
  {
    title: 'Creating a video',
    price: 167,
    description: 'Description',
    id: 3,
  },
  {
    title: 'Creating a video',
    price: 167,
    description:
      'lorem ipsum dolor sit amet consectetur, lorem ipsum dolor sit amet consectetur',
    id: 4,
  },
];

export function HomePage() {
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
                title={item.title}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
