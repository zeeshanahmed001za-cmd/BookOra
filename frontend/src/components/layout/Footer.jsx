import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="relative z-10 pt-20 pb-10"
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        minHeight: '30vh',
        color: '#fff',
      }}
    >
      <div className="max-w-[1490px] mx-auto px-10 grid gap-[60px]" style={{ gridTemplateColumns: '1.5fr 1fr 1.2fr 1fr' }}>

        {/* Column 1: Brand */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-[10px] text-white text-[1.4rem] font-extrabold"
              style={{
                background: 'linear-gradient(135deg,#a294fb,#8b5cf6)',
                boxShadow: '0 4px 15px rgba(162,148,251,0.3)',
              }}
            >
              B
            </div>
            <span
              className="text-[1.6rem] font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg,#a294fb,#8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Bookora
            </span>
          </div>

          <h3 className="text-[0.85rem] font-extrabold tracking-[0.15em] text-[#a294fb] uppercase mt-2.5">
            SELL YOUR BOOKS
          </h3>

          <div className="flex flex-col gap-3 text-[#606060] text-[0.9rem]">
            <p className="flex items-center gap-2.5"><MapPin size={16} /> 123 Bibliophile Lane, Storytown, ST 56789</p>
            <p className="flex items-center gap-2.5"><Phone size={16} /> +1 (555) BOOK-ORA</p>
            <p className="flex items-center gap-2.5"><Mail size={16} /> hello@bookora.com</p>
          </div>

          <div className="flex gap-3.5 mt-2.5">
            {[
              { label: 'Facebook', d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
              { label: 'Twitter', d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
            ].map(({ label, d }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-[38px] h-[38px] flex items-center justify-center rounded-full text-[#606060] transition-all duration-200 hover:text-[#a294fb] hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(162,148,251,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(162,148,251,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </a>
            ))}
            <a
              href="#"
              aria-label="Instagram"
              className="w-[38px] h-[38px] flex items-center justify-center rounded-full text-[#606060] transition-all duration-200 hover:text-[#a294fb] hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(162,148,251,0.1)'; e.currentTarget.style.borderColor = 'rgba(162,148,251,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Learn More */}
        <div className="flex flex-col gap-5">
          <h4 className="text-[0.82rem] font-extrabold tracking-[0.12em] text-white uppercase mb-2.5">LEARN MORE</h4>
          <ul className="flex flex-col gap-3">
            {['Our Story|/about','Book Blog|/blog','Careers|/careers','Sustainability|/sustainability','Press Kit|/press'].map(row => {
              const [label, path] = row.split('|');
              return (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-[#606060] no-underline text-[0.92rem] transition-all duration-200 hover:text-white hover:pl-1.5"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3: Shopping + Newsletter */}
        <div className="flex flex-col gap-5">
          <h4 className="text-[0.82rem] font-extrabold tracking-[0.12em] text-white uppercase mb-2.5">SHOPPING</h4>
          <ul className="flex flex-col gap-3">
            {['Browse All Books|/books','Special Offers|/deals','Gift Cards|/gift-cards','Membership|/membership'].map(row => {
              const [label, path] = row.split('|');
              return (
                <li key={label}>
                  <Link to={path} className="text-[#606060] no-underline text-[0.92rem] transition-all duration-200 hover:text-white hover:pl-1.5">
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Newsletter */}
          <div className="mt-5 pt-5 border-t border-white/[0.05]">
            <h5 className="text-[0.88rem] font-semibold text-[#a0a0a0] mb-3">Subscribe to our newsletter</h5>
            <div
              className="flex overflow-hidden rounded-lg transition-colors duration-200 focus-within:border-[#a294fb]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-none px-3 py-3 text-white text-[0.9rem] outline-none"
              />
              <button
                className="px-4 text-white transition-colors duration-200"
                style={{ background: '#a294fb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#b8adfc'}
                onMouseLeave={e => e.currentTarget.style.background = '#a294fb'}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Column 4: Customer Service */}
        <div className="flex flex-col gap-5">
          <h4 className="text-[0.82rem] font-extrabold tracking-[0.12em] text-white uppercase mb-2.5">CUSTOMER SERVICE</h4>
          <ul className="flex flex-col gap-3">
            {['Help Center|/help','Track My Order|/track-order','Returns & Exchanges|/returns','Shipping Info|/shipping','Contact Us|/contact'].map(row => {
              const [label, path] = row.split('|');
              return (
                <li key={label}>
                  <Link to={path} className="text-[#606060] no-underline text-[0.92rem] transition-all duration-200 hover:text-white hover:pl-1.5">
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div
        className="max-w-[1490px] mx-auto mt-[60px] px-10 pt-6 text-center text-[#606060] text-[0.8rem]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p>&copy; 2026 Bookora. Designed for the true bibliophile.</p>
      </div>
    </footer>
  );
};

export default Footer;
