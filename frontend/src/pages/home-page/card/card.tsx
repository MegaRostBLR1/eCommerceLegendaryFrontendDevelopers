import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const Card = ({
  title,
  price,
  description,
}: {
  title: string;
  price: number;
  description: string;
}) => {
  return (
    <div className="bestseller-card">
      <div className="bestseller-card-header">
        <span className="bestseller-card-title">{title}</span>
        <span className="bestseller-card-price">цена {price}$</span>
      </div>
      <p className="bestseller-card-description">{description}</p>
      <button className="bestseller-card-button">
        <span className="bestseller-card-button-text">оформить заказ</span>
        <ArrowForwardIosIcon className="bestseller-arrow-right" />
      </button>
    </div>
  );
};
