import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import './SubNav.css';

/* ── Data ────────────────────────────────────────────── */

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
  {
    label: 'BOOKS',
    path: '/books',
    megaMenu: true,  // special flag for mega dropdown
  },
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
  <div className="mega-menu">
    {/* ── Featured horizontal bar ── */}
    <div className="mega-featured-bar">
      {BOOKS_FEATURED.map((f) => (
        <Link key={f.label} to={f.path} className="mega-featured-link" onClick={onClose}>
          {f.label}
        </Link>
      ))}
    </div>

    {/* ── Category columns ── */}
    <div className="mega-categories">
      {BOOKS_CATEGORIES.map((cat) => (
        <div key={cat.heading} className="mega-category-col">
          <h4 className="mega-category-heading">{cat.heading}</h4>
          <ul className="mega-category-list">
            {cat.items.map((item) => (
              <li key={item.label}>
                <Link to={item.path} className="mega-category-link" onClick={onClose}>
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

const NavItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150); // small delay to bridge gaps
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* --- Books mega-menu item --- */
  if (item.megaMenu) {
    return (
      <div
        className="subnav-item subnav-item--mega"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="subnav-link subnav-trigger">
          {item.label}
          <ChevronDown size={14} className={open ? 'rotated' : ''} />
        </button>

        {open && <BooksMegaMenu onClose={() => setOpen(false)} />}
      </div>
    );
  }

  /* --- Plain link (no children) --- */
  if (!item.children) {
    return (
      <Link
        to={item.path}
        className={`subnav-link${item.label === 'TRACK MY ORDER' ? ' subnav-track' : ''}`}
      >
        {item.label}
      </Link>
    );
  }

  /* --- Standard dropdown --- */
  return (
    <div
      className="subnav-item"
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`subnav-link subnav-trigger${item.label === 'SELL YOUR BOOKS' ? ' subnav-cta' : ''}`}>
        {item.label}
        <ChevronDown size={14} className={open ? 'rotated' : ''} />
      </button>

      {open && (
        <div className="subnav-dropdown">
          {item.children.map((child) => (
            <Link
              key={child.label}
              to={child.path}
              className="dropdown-item"
              onClick={() => setOpen(false)}
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
  return (
    <div className="subnav glass">
      <div className="subnav-container">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SubNav;
