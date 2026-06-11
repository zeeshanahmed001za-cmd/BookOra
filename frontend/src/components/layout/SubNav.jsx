import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

/* ── Data ────────────────────────────────────────────────── */

const BOOKS_FEATURED = [
  { label: 'Best Sellers', path: '/books?badge=Bestseller' },
  { label: 'New Arrivals', path: '/books?sort=newest' },
  { label: 'Top Picks',    path: '/books?sort=TopRated' },
];

const BOOKS_CATEGORIES = [
  {
    heading: 'Fiction',
    items: [
      { label: 'Literary Fiction',      path: '/books?genre=LiteraryFiction' },
      { label: 'Thriller & Suspense',   path: '/books?genre=Thriller' },
      { label: 'Science Fiction',       path: '/books?genre=SciFi' },
      { label: 'Fantasy',               path: '/books?genre=Fantasy' },
      { label: 'Romance',               path: '/books?genre=Romance' },
      { label: 'Historical Fiction',    path: '/books?genre=HistoricalFiction' },
      { label: 'Horror',                path: '/books?genre=Horror' },
      { label: 'Mystery & Detective',   path: '/books?genre=Mystery' },
      { label: 'Adventure',             path: '/books?genre=Adventure' },
      { label: 'Short Stories',         path: '/books?genre=ShortStories' },
    ],
  },
  {
    heading: 'Non-Fiction',
    items: [
      { label: 'Biography & Memoir',    path: '/books?genre=Biography' },
      { label: 'Self-Help',             path: '/books?genre=SelfHelp' },
      { label: 'Business & Economics',  path: '/books?genre=Business' },
      { label: 'History',               path: '/books?genre=History' },
      { label: 'Science & Nature',      path: '/books?genre=Science' },
      { label: 'Philosophy',            path: '/books?genre=Philosophy' },
      { label: 'Psychology',            path: '/books?genre=Psychology' },
      { label: 'Travel',                path: '/books?genre=Travel' },
      { label: 'True Crime',            path: '/books?genre=TrueCrime' },
      { label: 'Health & Wellness',     path: '/books?genre=HealthWellness' },
    ],
  },
  {
    heading: 'Academic & Learning',
    items: [
      { label: 'Textbooks',             path: '/books?genre=Textbooks' },
      { label: 'Reference',             path: '/books?genre=Reference' },
      { label: 'Study Guides',          path: '/books?genre=StudyGuides' },
      { label: 'Competitive Exams',     path: '/books?genre=CompetitiveExams' },
      { label: 'Technology & Computing', path: '/books?genre=Technology' },
      { label: 'Mathematics',           path: '/books?genre=Mathematics' },
      { label: 'Engineering',           path: '/books?genre=Engineering' },
      { label: 'Medical',               path: '/books?genre=Medical' },
      { label: 'Law',                   path: '/books?genre=Law' },
      { label: 'Arts & Crafts',         path: '/books?genre=ArtsCrafts' },
    ],
  },
  {
    heading: 'Children & Young Adult',
    items: [
      { label: 'Picture Books',         path: '/books?genre=PictureBooks' },
      { label: 'Early Readers',         path: '/books?genre=EarlyReaders' },
      { label: 'Middle Grade',          path: '/books?genre=MiddleGrade' },
      { label: 'Young Adult Fiction',   path: '/books?genre=YAFiction' },
      { label: 'Young Adult Non-Fiction', path: '/books?genre=YANonFiction' },
      { label: 'Comics & Graphic Novels', path: '/books?genre=GraphicNovels' },
      { label: 'Activity Books',        path: '/books?genre=ActivityBooks' },
      { label: 'Educational',           path: '/books?genre=Educational' },
      { label: 'Fairy Tales & Folklore', path: '/books?genre=FairyTales' },
      { label: 'Mythology',             path: '/books?genre=Mythology' },
    ],
  },
];

const NAV_ITEMS = [
  { label: 'BOOKS', path: '/books', megaMenu: true },
  {
    label: 'GENRES',
    children: [
      { label: 'Fiction',      path: '/books?genre=Fiction' },
      { label: 'Non-Fiction',  path: '/books?genre=Non-Fiction' },
      { label: 'Science',      path: '/books?genre=Science' },
      { label: 'History',      path: '/books?genre=History' },
      { label: 'Biography',    path: '/books?genre=Biography' },
      { label: 'Mystery',      path: '/books?genre=Mystery' },
      { label: 'Romance',      path: '/books?genre=Romance' },
      { label: 'Children',     path: '/books?genre=Children' },
    ],
  },
  {
    label: 'AUTHORS',
    children: [
      { label: 'Featured Authors', path: '/authors' },
      { label: 'New Voices',       path: '/authors?type=new' },
    ],
  },
  { label: 'DEALS', path: '/deals' },
  {
    label: 'SELL YOUR BOOKS',
    children: [
      { label: 'Sell Your Books',   path: '/sell' },
      { label: 'Seller Dashboard',  path: '/sell/dashboard' },
      { label: 'Pricing Guide',     path: '/sell/pricing' },
      { label: 'Seller FAQ',        path: '/sell/faq' },
    ],
  },
  { label: 'TRACK MY ORDER', path: '/track-order' },
];

/* ── Mega-Menu for "Books" ─────────────────────────── */

const BooksMegaMenu = ({ onClose }) => (
  <div
    className="absolute top-full left-0 w-full animate-mega-slide z-[1000]"
    style={{
      background: 'rgba(10,10,10,0.97)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
    }}
  >
    {/* Featured bar */}
    <div
      className="flex items-center"
      style={{ background: 'linear-gradient(90deg,#7c3aed 0%,#a294fb 50%,#8b5cf6 100%)' }}
    >
      {BOOKS_FEATURED.map((f) => (
        <Link
          key={f.label}
          to={f.path}
          onClick={onClose}
          className="flex-1 text-center py-3.5 px-6 text-[0.88rem] font-bold tracking-[0.08em] uppercase text-white no-underline hover:bg-white/[0.12] transition-colors"
        >
          {f.label}
        </Link>
      ))}
    </div>

    {/* Category columns */}
    <div className="grid grid-cols-4 max-w-[1490px] mx-auto px-10 pt-8 pb-10">
      {BOOKS_CATEGORIES.map((cat) => (
        <div
          key={cat.heading}
          className="px-5 border-r border-white/[0.06] last:border-r-0"
        >
          <h4 className="text-[0.8rem] font-bold tracking-[0.1em] uppercase text-[#a294fb] mb-4 pb-2.5 border-b-2 border-[rgba(162,148,251,0.2)]">
            {cat.heading}
          </h4>
          <ul className="flex flex-col gap-0.5">
            {cat.items.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="block px-3 py-[7px] rounded-md text-[0.84rem] text-[#a0a0a0] no-underline transition-all duration-150 hover:bg-[rgba(162,148,251,0.08)] hover:text-white hover:pl-[18px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

/* ── Single nav item ───────────────────────────────── */

const NavItem = ({ item, onMegaMenuChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
    if (item.megaMenu) onMegaMenuChange(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      if (item.megaMenu) onMegaMenuChange(false);
    }, 150);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        if (item.megaMenu) onMegaMenuChange(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const linkBase = 'flex items-center gap-1.5 px-3.5 py-[5px] rounded-md text-[0.82rem] font-semibold tracking-[0.06em] text-[#a0a0a0] bg-transparent border-none cursor-pointer font-[inherit] whitespace-nowrap uppercase no-underline transition-all duration-150 hover:text-white hover:bg-white/[0.04]';

  /* Books mega-menu trigger only — menu itself is lifted to SubNav */
  if (item.megaMenu) {
    return (
      <div
        className="relative"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className={linkBase}>
          {item.label}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    );
  }

  /* Plain link */
  if (!item.children) {
    const isTrack = item.label === 'TRACK MY ORDER';
    return (
      <Link
        to={item.path}
        className={`${linkBase} ${isTrack ? 'text-[#606060] hover:text-[#a294fb] hover:bg-[rgba(162,148,251,0.08)]' : ''}`}
      >
        {item.label}
      </Link>
    );
  }

  /* Standard dropdown */
  const isCta = item.label === 'SELL YOUR BOOKS';
  return (
    <div
      className={`relative ${isCta ? 'ml-auto' : ''}`}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`${linkBase} ${isCta ? 'text-[#a294fb] hover:text-white hover:bg-[#a294fb]' : ''}`}>
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 min-w-[200px] rounded-[10px] z-[1000] p-1.5 animate-drop-in"
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Bridge gap */}
          <div className="absolute -top-3 left-0 w-full h-3 bg-transparent" />
          {item.children.map((child) => (
            <Link
              key={child.label}
              to={child.path}
              onClick={() => setOpen(false)}
              className="block px-3.5 py-2.5 rounded-[7px] text-[0.875rem] text-[#a0a0a0] no-underline transition-all duration-150 hover:bg-[#1a1a1a] hover:text-white"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── SubNav (bar) ──────────────────────────────────── */

const SubNav = () => {
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <div
      className="glass relative w-full z-[999] border-y border-white/10"
      style={{ height: '46px' }}
    >
      <div className="max-w-[1490px] h-full mx-auto px-10 flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            onMegaMenuChange={item.megaMenu ? setMegaOpen : () => {}}
          />
        ))}
      </div>

      {/* Mega menu rendered at SubNav level so it spans full width */}
      {megaOpen && (
        <BooksMegaMenu onClose={() => setMegaOpen(false)} />
      )}
    </div>
  );
};

export default SubNav;
