import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './card.css';
import type { Service } from '../../types';
import { CARD_TEXT } from './constants';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

interface CardProps {
  data: Service;
  handleClick: (service: Service) => void;
  isAdminMode?: boolean;
  isOrderCard?: boolean;
  onDelete?: (id: number) => void;
  onUpdateSuccess?: () => void;
}

export const Card = ({
  data,
  handleClick,
  isAdminMode = false,
  isOrderCard = false,
  onDelete,
}: CardProps) => {
  const formatValue = (num: number) => num.toFixed(2);

  const {
    id,
    name: title,
    amount: price,
    description,
    discount,
    workersCount: employeesCount,
    duration,
    categories,
  } = data;

  const hasDiscount = !!(discount && discount > 0);
  const oldPrice = hasDiscount ? price / (1 - discount / 100) : null;

  return (
    <>
      <div className="bestseller-card">
        <div className="bestseller-category-and-title">
          {isAdminMode && (
            <div className="admin-card-controls">
              <IconButton
                className={'edit-card-btn'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(data);
                }}
              >
                <BorderColorIcon fontSize="small" />
              </IconButton>
              <IconButton
                className={'delete-card-btn'}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          )}
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
                  <span className="bestseller-discount-badge">
                    -{discount}%
                  </span>
                </div>
              )}
              {price && (
                <div className="bestseller-current-price">
                  <span className="price-value">{formatValue(price)}</span>
                  <span className="price-currency">{CARD_TEXT.CURRENCY}</span>
                </div>
              )}
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
            <span className="details-label">{CARD_TEXT.EMPLOYEES_LABEL}</span>
            <span className="details-value">
              {employeesCount} {CARD_TEXT.SPECIALISTS_SUFFIX}
            </span>
          </div>
          <div className="details-item">
            <span className="details-label">{CARD_TEXT.DURATION_LABEL}</span>
            <span className="details-value">{duration}</span>
          </div>
        </div>

        {!isAdminMode && !isOrderCard && (
          <button
            className="bestseller-card-button"
            onClick={() => handleClick(data)}
          >
            <span className="bestseller-card-button-text">
              {CARD_TEXT.BUTTON_TEXT}
            </span>
            <ArrowForwardIosIcon className="bestseller-arrow-right" />
          </button>
        )}
      </div>
    </>
  );
};
