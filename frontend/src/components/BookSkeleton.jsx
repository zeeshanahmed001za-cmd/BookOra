import './BookSkeleton.css';

/** Shimmer placeholder card shown while books are loading. */
const BookSkeleton = () => (
  <div className="bsk-card" aria-hidden="true">
    <div className="bsk-cover shimmer" />
    <div className="bsk-body">
      <div className="bsk-line short shimmer" />
      <div className="bsk-line wide shimmer" />
      <div className="bsk-line mid shimmer" />
      <div className="bsk-line short shimmer" />
    </div>
    <div className="bsk-footer">
      <div className="bsk-line price shimmer" />
      <div className="bsk-btn shimmer" />
    </div>
  </div>
);

/** Grid of N skeleton cards — drop-in replacement for the books grid while loading. */
export const SkeletonGrid = ({ count = 8 }) => (
  <div className="books-grid">
    {Array.from({ length: count }, (_, i) => <BookSkeleton key={i} />)}
  </div>
);

export default BookSkeleton;
