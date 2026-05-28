import './PriceTag.css';

/**
 * PriceTag — Reusable e-commerce style price display component.
 *
 * Props:
 *   price         {number}  — Sale price in ₹
 *   originalPrice {number}  — Original/MRP price in ₹
 *   discount      {number}  — Discount % (optional, computed if missing)
 *   stock         {number}  — Stock count
 *   availability  {string}  — "In Stock" / "Only N left" / "Out of Stock"
 *   size          {string}  — "sm" | "md" | "lg" (default "md")
 */
const PriceTag = ({
  price,
  originalPrice,
  discount,
  stock,
  availability,
  size = 'md',
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = discount ?? (hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0);

  const isOutOfStock = stock === 0 || availability === 'Out of Stock';
  const isLowStock   = !isOutOfStock && (stock > 0 && stock <= 10);

  return (
    <div className={`price-tag price-tag--${size}`}>
      <div className="price-tag__row">
        <span className="price-tag__current">
          ₹{price?.toLocaleString('en-IN') ?? '—'}
        </span>

        {hasDiscount && (
          <span className="price-tag__original">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}

        {discountPct > 0 && (
          <span className="price-tag__badge">
            {discountPct}% OFF
          </span>
        )}
      </div>

      {availability && (
        <span
          className={`price-tag__stock ${
            isOutOfStock ? 'price-tag__stock--out'
            : isLowStock  ? 'price-tag__stock--low'
            : 'price-tag__stock--in'
          }`}
        >
          {availability}
        </span>
      )}
    </div>
  );
};

export default PriceTag;
