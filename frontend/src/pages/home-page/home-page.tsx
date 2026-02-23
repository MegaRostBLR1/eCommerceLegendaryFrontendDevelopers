import { Logo } from '../../components/icons/logo';
import './home-page.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card } from '../../components/card/card';
import { AnimationCube } from './ui/animation-cube/animation-cube';

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
      'lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam purus sit amet luctus venenatis description description',
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
            <Logo className="title-logo" />
            <h2 className="title-section-title">Услуги от ИИ</h2>
          </div>
        </div>
      </section>

      <section className="bestseller">
        <AnimationCube position="left" />
        <div className="page-container">
          <div className="bestseller-header">
            <h2 className="bestseller-title">Хит продаж</h2>
            <a className="bestseller-link" href="/Каталог/услуги">
              <span>Все улуги</span>
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
