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

  // Sizing styles mapping
  const currentSizes = {
    sm: 'text-base',
    md: 'text-[1.25rem]',
    lg: 'text-[1.75rem]',
  };

  const originalSizes = {
    sm: 'text-[0.78rem]',
    md: 'text-[0.9rem]',
    lg: 'text-[1.1rem]',
  };

  const badgeSizes = {
    sm: 'text-[0.65rem] px-[5px] py-[2px]',
    md: 'text-[0.72rem] px-[7px] py-[2px]',
    lg: 'text-[0.85rem] px-[9px] py-[3px]',
  };

  const stockSizes = {
    sm: 'text-[0.78rem]',
    md: 'text-[0.78rem]',
    lg: 'text-[0.85rem]',
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center flex-wrap gap-2">
        <span className={`font-bold text-text-primary tracking-[-0.3px] leading-none ${currentSizes[size]}`}>
          ₹{price?.toLocaleString('en-IN') ?? '—'}
        </span>

        {hasDiscount && (
          <span className={`line-through text-text-dim leading-none ${originalSizes[size]}`}>
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}

        {discountPct > 0 && (
          <span className={`inline-flex items-center rounded bg-gradient-to-br from-green-600 to-green-800 text-white font-bold tracking-[0.2px] leading-none whitespace-nowrap ${badgeSizes[size]}`}>
            {discountPct}% OFF
          </span>
        )}
      </div>

      {availability && (
        <span
          className={`font-medium tracking-[0.1px] ${stockSizes[size]} ${
            isOutOfStock ? 'text-text-dim'
            : isLowStock  ? 'text-orange-400'
            : 'text-green-400'
          }`}
        >
          {availability}
        </span>
      )}
    </div>
  );
};

export default PriceTag;
