import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './card.css';
import type { Category } from '../../types';

interface CardProps {
  title: string;
  price: number;
  description: string;
  discount?: number;
  employeesCount: number;
  duration: string;
  categories: Category[];
}

export const Card = ({
  title,
  price,
  description,
  discount,
  employeesCount,
  duration,
  categories,
}: CardProps) => {
  const formatValue = (num: number) => num.toFixed(2);

  const hasDiscount = !!(discount && discount > 0);
  const oldPrice = hasDiscount ? price / (1 - discount / 100) : null;

  return (
    <div className="bestseller-card">
      <div className="bestseller-category-and-title">
        <div className="bestseller-category-wrapper">
          {categories?.map((category) => (
            <span
              className="bestseller-category-tag"
              key={category.id}
              title={category.name}
            >
              {category.name}
            </span>
          ))}
        </div>
        <div className="bestseller-card-title-and-price">
          <h3 className="bestseller-card-title" title={title}>
            {title}
          </h3>
          <div className="bestseller-card-price-block">
            {hasDiscount && (
              <div className="bestseller-price-top">
                <span className="bestseller-old-price">
                  {formatValue(oldPrice!)}
                </span>
                <span className="bestseller-discount-badge">-{discount}%</span>
              </div>
            )}
            <div className="bestseller-current-price">
              <span className="price-value">{formatValue(price)}</span>
              <span className="price-currency">USD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bestseller-card-header">
        <div className="bestseller-card-main-info">
          <p className="bestseller-card-description">{description}</p>
        </div>
      </div>
      <div className="bestseller-card-details">
        <div className="details-item">
          <span className="details-label">КОЛИЧЕСТВО СОТРУДНИКОВ</span>
          <span className="details-value">{employeesCount} специалиста</span>
        </div>
        <div className="details-item">
          <span className="details-label">ДЛИТЕЛЬНОСТЬ ВЫПОЛНЕНИЯ</span>
          <span className="details-value">{duration}</span>
        </div>
      </div>

      <button className="bestseller-card-button">
        <span className="bestseller-card-button-text">ОФОРМИТЬ ЗАКАЗ</span>
        <ArrowForwardIosIcon className="bestseller-arrow-right" />
      </button>
    </div>
  );
};
