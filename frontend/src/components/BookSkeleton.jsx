/** Shimmer placeholder card shown while books are loading. */
const BookSkeleton = () => (
  <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden flex flex-col h-full pointer-events-none" aria-hidden="true">
    <div className="w-full aspect-[3/4] bg-bg-elevated shimmer-bg" />
    <div className="pt-4 px-4 pb-2.5 flex-1 flex flex-col gap-2">
      <div className="h-3 rounded bg-bg-elevated w-[45%] shimmer-bg" />
      <div className="h-4 rounded bg-bg-elevated w-[90%] shimmer-bg" />
      <div className="h-3 rounded bg-bg-elevated w-[70%] shimmer-bg" />
      <div className="h-3 rounded bg-bg-elevated w-[45%] shimmer-bg" />
    </div>
    <div className="pt-3 px-4 pb-4 border-t border-border-subtle flex justify-between items-center gap-3">
      <div className="h-4 rounded bg-bg-elevated w-[35%] shimmer-bg" />
      <div className="w-[95px] h-8 rounded-[30px] bg-bg-elevated shimmer-bg" />
    </div>
  </div>
);

/** Grid of N skeleton cards — drop-in replacement for the books grid while loading. */
export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-7">
    {Array.from({ length: count }, (_, i) => <BookSkeleton key={i} />)}
  </div>
);

export default BookSkeleton;
